const Joi = require('joi')

const stringId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({ 'string.pattern.base': 'Invalid mongodb id' })

module.exports = {
  stringId,
}
