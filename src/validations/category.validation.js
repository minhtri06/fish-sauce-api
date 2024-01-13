const Joi = require('joi')

module.exports = {
  createCategory: {
    body: Joi.object({
      name: Joi.string().required(),
    }),
  },
}
