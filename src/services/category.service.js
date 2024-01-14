const { StatusCodes } = require('http-status-codes')

const { cloudinary } = require('../configs/cloudinary.config')
const { HttpError } = require('../helpers')
const Category = require('../models/category.model')
const Product = require('../models/product.model')
const { pick } = require('../utils')

/**
 * Create a category
 * @param {{ name: string, image: string }} body
 * @returns {Promise<InstanceType<Category>>}
 */
const createCategory = async (body) => {
  const category = await Category.create(body)
  return category
}

/**
 * Get all categories
 * @returns {Promise<InstanceType<Category>[]>}
 */
const getAllCategories = async () => {
  const categories = await Category.find()
  return categories
}

/**
 * Update category by id
 * @param {string} categoryId
 * @param {Partial<{ name: string, image: string }>} body
 * @returns {Promise<InstanceType<Category>>}
 */
const updateCategoryById = async (categoryId, body) => {
  body = pick(body, 'name', 'image')
  console.log(body)
  const category = await Category.findById(categoryId)
  if (!category) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Category not found')
  }
  let oldImage
  if (body.image) {
    oldImage = category.image
  }
  Object.assign(category, body)
  await category.save()
  if (oldImage) {
    cloudinary.uploader.destroy(oldImage)
  }
  return category
}

/**
 * Delete category by id
 * @param {string} categoryId
 */
const deleteCategoryById = async (categoryId) => {
  const [category, productCount] = await Promise.all([
    Category.findById(categoryId),
    Product.countDocuments({ category: categoryId }),
  ])
  if (!category) {
    return
  }
  if (productCount !== 0) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Cannot delete because this category has ${productCount} products`,
      { type: 'category-has-products' },
    )
  }
  await category.deleteOne()
  cloudinary.uploader.destroy(category.image)
}

module.exports = {
  createCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
}
