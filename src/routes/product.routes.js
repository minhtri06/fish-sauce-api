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
  .patch(
    auth(),
    uploadManyImages('newImages', { required: false }),
    validate(validation.updateProduct),
    controller.updateProduct,
  )

router.patch(
  '/:productId/quantity',
  auth(),
  validate(validation.updateProductQuantity),
  controller.updateProductQuantity,
)

router
  .route('/:productId/images')
  .post(
    auth(),
    uploadManyImages('images', { maxCount: 10 }),
    validate(validation.addImages),
    controller.addImages,
  )
  .delete(auth(), validate(validation.removeImages), controller.removeImages)

module.exports = router
