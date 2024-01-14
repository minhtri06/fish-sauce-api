const { StatusCodes } = require('http-status-codes')

const categoryService = require('../services/category.service')
const { pick } = require('../utils')

/**
 * @typedef {import('express').RequestHandler} controller
 */

/** @type {controller} */
const createCategory = async (req, res) => {
  const category = await categoryService.createCategory({
    name: req.body.name,
    image: req.file.filename,
  })
  return res.status(StatusCodes.CREATED).json({ category })
}

/** @type {controller} */
const getAllCategories = async (req, res) => {
  const categories = await categoryService.getAllCategories()
  return res.json({ categories })
}

/** @type {controller} */
const updateCategoryById = async (req, res) => {
  const { categoryId } = req.params
  const body = pick(req.body, 'name')
  if (req.file) {
    body.image = req.file.filename
  }
  const category = await categoryService.updateCategoryById(categoryId, body)
  return res.json({ category })
}

/** @type {controller} */
const deleteCategoryById = async (req, res) => {
  const { categoryId } = req.params
  await categoryService.deleteCategoryById(categoryId)
  return res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = {
  createCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
}
