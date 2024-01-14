const router = require('express').Router()

router.use('/auth', require('./auth.routes'))
router.use('/categories', require('./category.routes'))
router.use('/tags', require('./tag.routes'))

module.exports = router
