const router = require('express').Router()

router.use('/auth', require('./auth.routes'))
router.use('/categories', require('./category.routes'))

module.exports = router
