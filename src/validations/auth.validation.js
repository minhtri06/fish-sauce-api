const Joi = require('joi')

module.exports = {
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
  },

  logout: {
    body: {
      refreshToken: Joi.string().required(),
    },
  },

  refreshTokens: {
    body: {
      accessToken: Joi.string().required(),
      refreshToken: Joi.string().required(),
    },
  },
}
