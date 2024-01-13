const Category = require('../models/category.model')

/**
 * Create a category
 * @param {{ name: string, image: string }} body
 * @returns {Promise<InstanceType<Category>>}
 */
const createCategory = async (body) => {
  const category = await Category.create(body)
  return category
}

module.exports = { createCategory }
