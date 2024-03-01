const { StatusCodes } = require('http-status-codes')

const invoiceService = require('../services/invoice.service')

/**
 * @typedef {import('express').RequestHandler} controller
 */

/** @type {controller} */
const createInvoice = async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.body)
  return res.status(StatusCodes.CREATED).json({
    message: 'Create invoice successfully',
    invoice,
  })
}

/** @type {controller} */
const getInvoices = async (req, res) => {
  const result = await invoiceService.getInvoices(req.query)
  return res.json(result)
}

module.exports = { createInvoice, getInvoices }
