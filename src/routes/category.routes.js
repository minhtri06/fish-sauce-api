const router = require('express').Router()

const { auth, validate, uploadImage } = require('../middlewares')
const validation = require('../validations/category.validation')
const controller = require('../controllers/category.controller')

router
  .route('/')
  .get(controller.getAllCategories)
  .post(
    auth(),
    uploadImage('image'),
    validate(validation.createCategory),
    controller.createCategory,
  )

router
  .route('/:categoryId')
  .patch(
    auth(),
    uploadImage('image', { required: false }),
    validate(validation.updateCategoryById),
    controller.updateCategoryById,
  )
  .delete(
    auth(),
    validate(validation.deleteCategoryById),
    controller.deleteCategoryById,
  )

module.exports = router
