const Joi = require('joi')
const { stringId } = require('./custom.validation')

module.exports = {
  createCategory: {
    body: Joi.object({
      name: Joi.string().required(),
    }),
  },

  updateCategoryById: {
    params: Joi.object({
      categoryId: stringId.required(),
    }),
    body: Joi.object({
      name: Joi.string(),
    }),
  },

  deleteCategoryById: {
    params: Joi.object({
      categoryId: stringId.required(),
    }),
  },
}
