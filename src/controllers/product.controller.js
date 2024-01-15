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

module.exports = { createProduct }
