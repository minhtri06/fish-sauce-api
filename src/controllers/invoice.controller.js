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

/** @type {controller} */
const cancelInvoice = async (req, res) => {
  const { invoiceId } = req.params
  await invoiceService.cancelInvoice(invoiceId)
  return res.status(StatusCodes.OK).json({
    message: 'Cancel invoice successfully',
  })
}

/** @type {controller} */
const confirmInvoice = async (req, res) => {
  const { invoiceId } = req.params
  await invoiceService.confirmInvoice(invoiceId)
  return res.status(StatusCodes.OK).json({
    message: 'Confirm invoice successfully',
  })
}

module.exports = { createInvoice, getInvoices, cancelInvoice, confirmInvoice }
