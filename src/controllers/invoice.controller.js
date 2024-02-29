const { StatusCodes } = require('http-status-codes')

const invoiceService = require('../services/invoice.service')

/**
 * @typedef {import('express').RequestHandler} controller
 */

/** @type {controller} */
const createInvoice = async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.body)
  return res.status(StatusCodes.CREATED).json({ invoice })
}

module.exports = { createInvoice }
