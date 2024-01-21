const Joi = require('joi')

module.exports = {
  stringId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({ 'string.pattern.base': 'Invalid mongodb id' }),

  page: Joi.number().integer().min(1),

  limit: Joi.number().integer().min(1),
}
