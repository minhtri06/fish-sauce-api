const { StatusCodes } = require('http-status-codes')

const productService = require('../services/product.service')
const { HttpError } = require('../helpers')

/** @typedef {import('express').RequestHandler} controller */

/** @type {controller} */
const createProduct = async (req, res) => {
  const images = req.files.map((file) => file.filename)
  const body = { ...req.body, images }
  const product = await productService.createProduct(body)
  return res.status(StatusCodes.CREATED).json({ product })
}

/** @type {controller} */
const getProducts = async (req, res) => {
  const isAdmin = !!req.user
  const result = await productService.getProducts(req.query, isAdmin)
  return res.json(result)
}

/** @type {controller} */
const getProductById = async (req, res) => {
  const { productId } = req.params
  const isAdmin = !!req.user
  const product = await productService.getProductById(productId, isAdmin)
  return res.json({ product })
}

/** @type {controller} */
const updateProduct = async (req, res) => {
  const { productId } = req.params
  const newImages = req.files?.map((file) => file.filename)
  const product = await productService.updateProduct(productId, req.body, newImages)
  return res.json({ product })
}

/** @type {controller} */
const updateProductQuantity = async (req, res) => {
  const { productId } = req.params
  const { quantityChange } = req.body
  const product = await productService.updateProductQuantity(productId, quantityChange)
  return res.json({ product })
}

/** @type {controller} */
const addImages = async (req, res) => {
  const { productId } = req.params
  if (!req.files) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Images is required')
  }
  const newImages = req.files.map((file) => file.filename)
  const product = await productService.addImages(productId, newImages)
  return res.json({ product })
}

/** @type {controller} */
const removeImages = async (req, res) => {
  const { productId } = req.params
  const { removedImages } = req.body
  const product = await productService.removeImages(productId, removedImages)
  return res.json({ product })
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
