const { StatusCodes } = require('http-status-codes')

const Product = require('../models/product.model')
const Invoice = require('../models/invoice.model')
const Province = require('../models/province.model')
const District = require('../models/district.model')
const Commune = require('../models/commune.model')
const { pick } = require('../utils')
const { HttpError } = require('../helpers')
const { PAYMENT_METHODS, INVOICE_STATUSES } = require('../common/constants')

/**
 * Create an invoice
 * @param {{
 *  products: { productId: string, quantity: number }[],
 *  customerName: string,
 *  phoneNumber: string,
 *  email: string,
 *  provinceCode: number,
 *  districtCode: number,
 *  communeCode: number,
 *  address: string,
 *  paymentMethod: 'cod' | 'momo'
 * }} body
 */
const createInvoice = async (body) => {
  body = pick(
    body,
    'products',
    'customerName',
    'phoneNumber',
    'email',
    'provinceCode',
    'districtCode',
    'communeCode',
    'address',
    'paymentMethod',
  )

  const [province, district, commune, products] = await Promise.all([
    Province.findOne({ code: body.provinceCode }),

    District.findOne({ code: body.districtCode }),

    Commune.findOne({ code: body.communeCode }),

    pickUpProducts(body.products),
  ])

  if (!province) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Province not found')
  }
  if (!district) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'District not found')
  }
  if (!commune) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Commune not found')
  }

  body.products = products

  const invoice = new Invoice(body)

  invoice.province = province.name
  invoice.district = district.name
  invoice.commune = commune.name
  let totalPrice = 0
  products.forEach((p) => {
    totalPrice += p.price
  })
  invoice.totalPrice = totalPrice
  if (body.paymentMethod === PAYMENT_METHODS.COD) {
    invoice.status = INVOICE_STATUSES.WAITING_FOR_DELIVERY
  }
  if (body.paymentMethod === PAYMENT_METHODS.MOMO) {
    invoice.status = INVOICE_STATUSES.WAITING_FOR_PAYMENT
  }

  await invoice.save()

  return invoice
}

/**
 * Pick up products
 * - Decrease the quantity of each product
 * - If success return picked up products. If fail, send back products
 * @param {{ productId: string, quantity: number }[]} pickUpItems
 * @returns {Promise<{_id, name, price, discount, quantity}[]>}
 */
const pickUpProducts = async (pickUpItems) => {
  const products = await Promise.all(
    pickUpItems.map(
      (async ({ productId, quantity }) => {
        const product = await Product.findOneAndUpdate(
          { _id: productId, quantity: { $gte: quantity } },
          { $inc: { quantity: -quantity } },
          { new: true },
        )
        if (product) {
          const { _id, name, price, discount } = product
          return { _id, name, price, discount, quantity }
        }
        return null
      })(),
    ),
  )

  if (products.includes(null)) {
    // if a product is null, it is out of stock => send back the picked up products
    const sendBackItems = []
    const outOfStockProductIds = []
    products.forEach((product, i) => {
      if (!product) {
        outOfStockProductIds.push(pickUpItems[i].productId)
      } else {
        sendBackItems.push({
          productId: pickUpItems[i].productId,
          quantity: pickUpItems[i].quantity,
        })
      }
    })
    await sendBackProducts(sendBackItems)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Product out of stock', {
      type: 'product-out-of-stock',
      details: { outOfStockProductIds },
    })
  }

  return products
}

/**
 * Send back products
 * @param {{ productId: string, quantity: number }[]} sendBackItems
 */
const sendBackProducts = async (sendBackItems) => {
  await Promise.all(
    sendBackItems.map(({ productId, quantity }) =>
      Product.updateOne({ _id: productId }, { $inc: { quantity } }),
    ),
  )
}

module.exports = {
  createInvoice,
}
