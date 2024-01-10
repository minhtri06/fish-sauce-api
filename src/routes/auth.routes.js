const router = require('express').Router()

const controller = require('../controllers/auth.controller')
const validation = require('../validations/auth.validation')
const { validate } = require('../middlewares')

router.post('/login', validate(validation.login), controller.login)

module.exports = router
