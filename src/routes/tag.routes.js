const router = require('express').Router()

const { auth, validate } = require('../middlewares')
const validation = require('../validations/tag.validation')
const controller = require('../controllers/tag.controller')

router
  .route('/')
  .get(controller.getAllTag)
  .post(auth(), validate(validation.createTag), controller.createTag)

router
  .route('/:tagId')
  .patch(auth(), validate(validation.updateTagById), controller.updateTagById)
  .delete(auth(), validate(validation.deleteTagById), controller.deleteTagById)

module.exports = router
