const { PRODUCT_STATUSES } = require('../constants')
const { validateSortString, HttpError } = require('../helpers')
const Product = require('../models/product.model')
const { pick } = require('../utils')
const { StatusCodes } = require('http-status-codes')

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
 * @param {boolean} isAdmin
 * @returns {Promise<{data: InstanceType<Product>[]}>}
 */
const getProducts = async (
  { categoryId, tagIds, page, limit, checkPaginate, sort },
  isAdmin,
) => {
  const filter = {}
  let select = ''
  if (!isAdmin) {
    filter.status = PRODUCT_STATUSES.ACTIVE
    select = '-quantity -status'
  }
  if (categoryId) {
    filter.category = categoryId
  }
  if (tagIds && tagIds.length !== 0) {
    filter.tags = { $in: tagIds }
  }
  if (sort) {
    validateSortString(sort, ['price', 'createdAt'])
  }
  const result = await Product.paginate(filter, {
    page,
    limit,
    select,
    checkPaginate,
    sort,
    populate: 'category',
  })
  return result
}

const getProductById = async (productId, isAdmin) => {
  const query = Product.findById(productId).populate(['category', 'tags'])
  if (!isAdmin) {
    query.select('-quantity -status')
    query.where('status', PRODUCT_STATUSES.ACTIVE)
  }
  const product = await query.exec()
  if (!product) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Product not found')
  }
  return product
}

/**
 * Update product
 * @param {string} productId
 * @param {{
 *  name: string
 *  description: string
 *  price: number
 *  discount: number
 *  status: string
 *  category: string
 *  tags: string[]
 * }} body
 * @returns {Promise<InstanceType<Product>>}
 */
const updateProduct = async (productId, body) => {
  const product = await Product.findById(productId)
  if (!product) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Product not found')
  }

  Object.assign(
    product,
    pick(body, 'name', 'description', 'price', 'discount', 'status', 'category', 'tags'),
  )
  await product.save()

  return product
}

/**
 * Update product quantity
 * @param {string} productId
 * @param {number} quantityChange
 * @returns {Promise<InstanceType<Product>>}
 */
const updateProductQuantity = async (productId, quantityChange) => {
  const update = { $inc: { quantity: quantityChange } }
  const filter = { _id: productId }
  if (quantityChange < 0) {
    filter.quantity = { $gte: -quantityChange }
  }
  const product = await Product.findOneAndUpdate(filter, update, { new: true })
  if (!product) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Update failed')
  }
  return product
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateProductQuantity,
}
