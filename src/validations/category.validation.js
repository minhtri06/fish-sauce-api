const Joi = require('joi')
const { stringId } = require('./custom.validation')

module.exports = {
  createCategory: {
    body: {
      name: Joi.string().required(),
    },
  },

  updateCategoryById: {
    params: {
      categoryId: stringId.required(),
    },
    body: {
      name: Joi.string(),
    },
  },

  deleteCategoryById: {
    params: {
      categoryId: stringId.required(),
    },
  },
}
