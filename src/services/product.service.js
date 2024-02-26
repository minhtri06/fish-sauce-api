const { PRODUCT_STATUSES } = require('../common/constants')
const { validateSortString, HttpError } = require('../helpers')
const Product = require('../models/product.model')
const Category = require('../models/category.model')
const Tag = require('../models/tag.model')
const { pick } = require('../utils')
const { StatusCodes } = require('http-status-codes')
const { cloudinary } = require('../configs/cloudinary.config')

/**
 * Create product
 * @param {{
 *  name: string
 *  description?: string
 *  price: number
 *  discount?: number
 *  quantity?: number
 *  status?: 'active' | 'inactive'
 *  category: string
 *  images: string[]
 *  tags?: string[]
 * }} body
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
  const [categoryCount, tagCount] = await Promise.all([
    Category.countDocuments({ _id: body.category }),
    Tag.countDocuments({ _id: { $in: body.tags } }),
  ])
  if (categoryCount === 0) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Category does not exist')
  }
  if (tagCount !== body.tags.length) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Tag does not exist')
  }
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
  { categoryId, tagIds, page, limit, checkPaginate, sort, status, name },
  isAdmin,
) => {
  const filter = {}

  let select = ''
  if (!isAdmin) {
    // non-admin user can only get active products
    filter.status = PRODUCT_STATUSES.ACTIVE
    // non-admin user can only get product with quantity > 0
    filter.quantity = { $gt: 0 }
    // non-admin user cannot see quantity, status
    select = '-quantity -status'
  } else {
    if (status) {
      filter.status = status
    }
  }

  if (categoryId) {
    filter.category = categoryId
  }
  if (tagIds && tagIds.length !== 0) {
    filter.tags = { $in: tagIds }
  }
  if (name && name !== '') {
    filter.$text = { $search: `"${name}"` }
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

/**
 * Get product by id
 * @param {string} productId
 * @param {boolean} isAdmin
 * @returns {Promise<InstanceType<Product>>}
 */
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
 *  images: string[]
 * }} body
 * @param {string[] | undefined} newImages
 * @returns {Promise<InstanceType<Product>>}
 */
const updateProduct = async (productId, body, newImages) => {
  if (body.category) {
    const categoryCount = await Category.countDocuments({ _id: body.category })
    if (categoryCount === 0) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Category does not exist')
    }
  }
  if (body.tags) {
    const tagCount = await Tag.countDocuments({ _id: { $in: body.tags } })
    if (tagCount !== body.tags.length) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Tag does not exist')
    }
  }
  const product = await Product.findById(productId)
  if (!product) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Product not found')
  }

  if (body.images) {
    const removedImages = product.images.filter((image) => !body.images.includes(image))
    cloudinary.api.delete_resources(removedImages)
    product.images.pull(...removedImages)
  }
  if (newImages) {
    product.images.push(...newImages)
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

/**
 * Add images
 * @param {string} productId
 * @param {string[]} newImages
 * @returns {Promise<InstanceType<Product>>}
 */
const addImages = async (productId, newImages) => {
  if (!newImages) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Images are required')
  }
  const product = await Product.findById(productId)
  if (!product) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Product not found')
  }
  product.images.push(...newImages)
  await product.save()
  return product
}

/**
 *
 * @param {string} productId
 * @param {string[]} removedImages
 */
const removeImages = async (productId, removedImages) => {
  const product = await Product.findById(productId)
  if (!product) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Product not found')
  }
  cloudinary.api.delete_resources(removedImages)
  product.images.pull(...removedImages)
  await product.save()
  return product
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateProductQuantity,
  addImages,
  removeImages,
}
