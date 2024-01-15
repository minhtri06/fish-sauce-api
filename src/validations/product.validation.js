const Joi = require('joi')
const { stringId } = require('./custom.validation')

module.exports = {
  createProduct: {
    body: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().integer().min(0).required(),
      discount: Joi.number().integer().min(0),
      quantity: Joi.number().integer().min(0),
      status: Joi.string(),
      category: stringId.required(),
      tags: Joi.array().items(stringId).required(),
    },
  },
}
