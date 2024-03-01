const router = require('express').Router()

const { validate, auth } = require('../middlewares')
const validation = require('../validations/invoice.validation')
const controller = require('../controllers/invoice.controller')

router
  .route('/')
  .get(auth(), validate(validation.getInvoices), controller.getInvoices)
  .post(validate(validation.createInvoice), controller.createInvoice)

module.exports = router
