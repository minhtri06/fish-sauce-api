const router = require('express').Router()

const { validate } = require('../middlewares')
const validation = require('../validations/invoice.validation')
const controller = require('../controllers/invoice.controller')

router.route('/').post(validate(validation.createInvoice), controller.createInvoice)

module.exports = router
