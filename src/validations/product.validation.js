const Joi = require('joi')
const { stringId, page, limit } = require('./custom.validation')

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
      tags: Joi.array().items(Joi.string()).required(),
    },
  },

  getProducts: {
    query: {
      categoryId: stringId,
      tagIds: Joi.array().items(Joi.string()),
      page: page,
      limit: limit,
      checkPaginate: Joi.boolean(),
      sort: Joi.string(),
    },
  },

  getProductById: {
    params: {
      productId: stringId.required(),
    },
  },

  updateProduct: {
    params: {
      productId: stringId.required(),
    },
    body: {
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number().integer().min(0),
      discount: Joi.number().integer().min(0),
      status: Joi.string(),
      category: Joi.string(),
      tags: Joi.array().items(Joi.string()),
    },
  },

  updateProductQuantity: {
    params: {
      productId: stringId.required(),
    },
    body: {
      quantityChange: Joi.number().integer().required(),
    },
  },
}
