require('dotenv').config()
const Joi = require('joi')

const envSchema = Joi.object({
  PORT: Joi.number().integer().min(1).required(),

  NODE_ENV: Joi.string().valid('dev', 'prod').required(),

  CLIENT_URL: Joi.string().required(),

  DEFAULT_PAGE_LIMIT: Joi.number().integer().min(5).required(),

  MONGODB_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().integer().min(1).required(),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().integer().min(1).required(),
}).unknown()

const { value: envVars, error } = envSchema.validate(process.env)
if (error) {
  throw new Error('Config validation error: ' + error.message)
}

const ENV_CONFIG = {
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,

  CLIENT_URL: envVars.CLIENT_URL,

  DEFAULT_PAGE_LIMIT: envVars.DEFAULT_PAGE_LIMIT,

  MONGODB: {
    URL: envVars.MONGODB_URL,
  },

  JWT: {
    SECRET: envVars.JWT_SECRET,
    ACCESS_EXPIRATION_MINUTES: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    REFRESH_EXPIRATION_DAYS: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
}

module.exports = ENV_CONFIG