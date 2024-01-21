const router = require('express').Router()

const { auth, uploadManyImages, validate } = require('../middlewares')
const validation = require('../validations/product.validation')
const controller = require('../controllers/product.controller')
const { isRequired } = require('nodemon/lib/utils')

router
  .route('/')
  .get(auth({ isRequired: false }), validate(validation.getProducts), controller.getProducts)
  .post(
    auth(),
    uploadManyImages('images', { maxCount: 10 }),
    validate(validation.createProduct),
    controller.createProduct,
  )

module.exports = router
