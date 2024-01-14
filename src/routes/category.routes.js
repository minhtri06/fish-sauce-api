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

module.exports = router
