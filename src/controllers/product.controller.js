const { StatusCodes } = require('http-status-codes')

const productService = require('../services/product.service')

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
  let select = ''
  if (!req.user) {
    // if not admin
    select = '-quantity -status'
  }
  const result = await productService.getProducts({ ...req.query, select })
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
  const product = await productService.updateProduct(productId, req.body)
  return res.json({ product })
}

/** @type {controller} */
const updateProductQuantity = async (req, res) => {
  const { productId } = req.params
  const { quantityChange } = req.body
  const product = await productService.updateProductQuantity(productId, quantityChange)
  return res.json({ product })
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateProductQuantity,
}
