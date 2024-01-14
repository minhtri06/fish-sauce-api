const Joi = require('joi')
const { stringId } = require('./custom.validation')

module.exports = {
  createCategory: {
    body: Joi.object({
      name: Joi.string().required(),
    }),
  },

  deleteCategoryById: {
    params: Joi.object({
      categoryId: stringId.required(),
    }),
  },
}
