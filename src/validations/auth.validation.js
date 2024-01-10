const Joi = require('joi')

module.exports = {
  login: {
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },

  logout: {
    body: Joi.object({
      refreshToken: Joi.string().required(),
    }),
  },
}
