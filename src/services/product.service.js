const Product = require('../models/product.model')
const { pick } = require('../utils')

/**
 * Create product
 * @param {
 *  name: string
 *  description?: string
 *  price: number
 *  discount?: number
 *  quantity?: number
 *  status?: 'active' | 'inactive'
 *  category: string
 *  images: string[]
 *  tags?: string[]
 * } body
 * @returns {Promise<InstanceType<Product>>}
 */
const createProduct = async (body) => {
  body = pick(
    body,
    'name',
    'description',
    'price',
    'discount',
    'quantity',
    'status',
    'category',
    'images',
    'tags',
  )
  const product = await Product.create(body)
  return product
}

module.exports = { createProduct }
