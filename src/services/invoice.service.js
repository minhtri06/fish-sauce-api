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
 *   products: { productId: string, quantity: number }[],
 *   customerName: string,
 *   phoneNumber: string,
 *   email: string,
 *   provinceCode: number,
 *   districtCode: number,
 *   communeCode: number,
 *   address: string,
 *   paymentMethod: 'cod' | 'momo'
 * }} body
 * @returns {Promise<InstanceType<Invoice>>}
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

  const { province, district, commune } = await validateLocation(body)

  const products = await pickUpProducts(body.products)

  body.products = products

  const invoice = new Invoice(body)

  invoice.province = province.name
  invoice.district = district.name
  invoice.commune = commune.name

  let totalPrice = 0
  products.forEach((p) => {
    totalPrice += (p.price - p.discount) * p.quantity
  })
  invoice.totalPrice = totalPrice

  if (body.paymentMethod === PAYMENT_METHODS.COD) {
    invoice.status = INVOICE_STATUSES.WAITING_FOR_DELIVERY
  }
  if (body.paymentMethod === PAYMENT_METHODS.MOMO) {
    invoice.status = INVOICE_STATUSES.WAITING_FOR_PAYMENT
  }

  try {
    await invoice.save()
    return invoice
  } catch (error) {
    const sendBackItems = products.map((p) => ({
      productId: p.product,
      quantity: p.quantity,
    }))
    await sendBackProducts(sendBackItems)
    throw error
  }
}

/**
 * Validate location
 * @param {{ provinceCode: number, districtCode: number, communeCode: number }} param0
 * @returns {Promise<{
 *   province: InstanceType<Province>,
 *   district: InstanceType<District>,
 *   commune: InstanceType<Commune>
 * }>}
 */
const validateLocation = async ({ provinceCode, districtCode, communeCode }) => {
  const [province, district, commune] = await Promise.all([
    Province.findOne({ code: provinceCode }),
    District.findOne({ code: districtCode }),
    Commune.findOne({ code: communeCode }),
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

  if (district.provinceCode !== provinceCode) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `'${district.name}' is not in '${province.name}'`,
    )
  }
  if (commune.districtCode !== districtCode) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `'${commune.name}' is not in '${district.name}'`,
    )
  }

  return { province, district, commune }
}

/**
 * Pick up products
 * - Decrease the quantity of each product
 * - If success return picked up products. If fail, send back products
 * @param {{ productId: string, quantity: number }[]} pickUpItems
 * @returns {Promise<{product, name, price, discount, quantity}[]>}
 */
const pickUpProducts = async (pickUpItems) => {
  const products = await Promise.all(
    pickUpItems.map(({ productId, quantity }) => {
      return Product.findOneAndUpdate(
        { _id: productId, quantity: { $gte: quantity } },
        { $inc: { quantity: -quantity } },
        { new: true },
      )
    }),
  )

  if (products.includes(null)) {
    // if a product is null, it does not have enough quantity
    // => send back the picked up products
    const sendBackItems = []
    const insufficientQuantityProductIds = []
    products.forEach((product, i) => {
      if (!product) {
        insufficientQuantityProductIds.push(pickUpItems[i].productId)
      } else {
        const { productId, quantity } = pickUpItems[i]
        sendBackItems.push({ productId, quantity })
      }
    })
    await sendBackProducts(sendBackItems)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Insufficient product quantity', {
      type: 'insufficient-product-quantity',
      details: { insufficientQuantityProductIds },
    })
  }

  return products.map((product, i) => {
    if (product) {
      const { name, price, discount } = product
      const { productId, quantity } = pickUpItems[i]
      return { product: productId, name, price, discount, quantity }
    }
  })
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
