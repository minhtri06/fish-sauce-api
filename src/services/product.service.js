const { validateSortString } = require('../helpers')
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

/**
 *
 * @param {{
 *  categoryId?: string,
 *  tagIds?: string[],
 *  page?: number,
 *  limit?: number
 * }} param0
 */
const getProducts = async ({ categoryId, tagIds, page, limit, select, checkPaginate, sort }) => {
  const filter = {}
  if (categoryId) {
    filter.category = categoryId
  }
  if (tagIds && tagIds.length !== 0) {
    filter.tags = { $in: tagIds }
  }
  if (sort) {
    validateSortString(sort, ['price', 'createdAt'])
  }
  const result = await Product.paginate(filter, { page, limit, select, checkPaginate, sort })
  return result
}

module.exports = { createProduct, getProducts }
