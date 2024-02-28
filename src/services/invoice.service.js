const Invoice = require('../models/invoice.model')
const { pick } = require('../utils')

/**
 *
 * @param {
 *  productIds: string[]
 *  customerName: string
 *  phoneNumber: string
 *  province: string
 *  district: string
 *  address: string
 *  email: string
 *  paymentMethod: 'cod' | 'momo'
 * } body
 */
const createInvoice = async (body) => {
  body = pick(
    body,
    'products',
    'customerName',
    'phoneNumber',
    'province',
    'district',
    'address',
    'email',
    'paymentMethod',
  )

  const products = []
  await Promise.all(body)
}
