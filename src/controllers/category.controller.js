const { StatusCodes } = require('http-status-codes')

const categoryService = require('../services/category.service')

/** @type {import('express').RequestHandler} */
const createCategory = async (req, res) => {
  const category = await categoryService.createCategory({
    name: req.body.name,
    image: req.file.filename,
  })
  return res.status(StatusCodes.CREATED).json({ category })
}

/** @type {import('express').RequestHandler} */
const getAllCategories = async (req, res) => {
  const categories = await categoryService.getAllCategories()
  return res.json({ categories })
}

/** @type {import('express').RequestHandler} */
const deleteCategoryById = async (req, res) => {
  const { categoryId } = req.params
  await categoryService.deleteCategoryById(categoryId)
  return res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = { createCategory, getAllCategories, deleteCategoryById }
