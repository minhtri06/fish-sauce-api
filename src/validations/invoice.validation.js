const Joi = require('joi')

const { stringId, page, limit } = require('./custom.validation')
const { PAYMENT_METHODS } = require('../common/constants')

module.exports = {
  createInvoice: {
    body: {
      products: Joi.array()
        .items(
          Joi.object({
            productId: stringId.required(),
            quantity: Joi.number().integer().min(1).required(),
          }).required(),
        )
        .min(1)
        .unique((item1, item2) => item1.productId === item2.productId)
        .message({ 'array.unique': 'Duplicate productId' })
        .required(),
      customerName: Joi.string().required(),
      phoneNumber: Joi.string()
        .min(9)
        .max(15)
        .pattern(/^[0-9]+$/)
        .messages({ 'string.pattern.base': 'Invalid phoneNumber' })
        .required(),
      email: Joi.string().email(),
      provinceCode: Joi.number().integer().required(),
      districtCode: Joi.number().integer().required(),
      communeCode: Joi.number().integer().required(),
      address: Joi.string().required(),
      paymentMethod: Joi.string()
        .valid(...Object.values(PAYMENT_METHODS))
        .required(),
    },
  },

  getInvoices: {
    query: {
      page: page,
      limit: limit,
      checkPaginate: Joi.boolean(),
      includeProduct: Joi.boolean(),
    },
  },

  cancelInvoice: {
    params: {
      invoiceId: stringId.required(),
    },
  },

  confirmInvoice: {
    params: {
      invoiceId: stringId.required(),
    },
  },
}
