const router = require('express').Router()

const { auth, uploadManyImages, validate } = require('../middlewares')
const validation = require('../validations/product.validation')
const controller = require('../controllers/product.controller')
const { isRequired } = require('nodemon/lib/utils')

router
  .route('/')
  .get(
    auth({ isRequired: false }),
    validate(validation.getProducts),
    controller.getProducts,
  )
  .post(
    auth(),
    uploadManyImages('images', { maxCount: 10 }),
    validate(validation.createProduct),
    controller.createProduct,
  )

router
  .route('/:productId')
  .get(
    auth({ isRequired: false }),
    validate(validation.getProductById),
    controller.getProductById,
  )
  .patch(auth(), validate(validation.updateProduct), controller.updateProduct)

router.patch(
  '/:productId/quantity',
  auth(),
  validate(validation.updateProductQuantity),
  controller.updateProductQuantity,
)

module.exports = router
