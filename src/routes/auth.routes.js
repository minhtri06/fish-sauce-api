const router = require('express').Router()

const controller = require('../controllers/auth.controller')
const validation = require('../validations/auth.validation')
const { validate } = require('../middlewares')

router.post('/login', validate(validation.login), controller.login)
router.post('/logout', validate(validation.logout), controller.logout)

module.exports = router
