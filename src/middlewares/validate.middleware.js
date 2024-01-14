const Joi = require('joi')
const { HttpError } = require('../helpers')
const { StatusCodes } = require('http-status-codes')

const emptyObj = Joi.object({}).required()

/**
 * Returns a validate middleware
 * @param {{ body: Object, params: Object, query: Object}} schema
 * @returns {import('express').RequestHandler}
 */
const validate = (schema) => {
  const { body, params, query } = schema
  schema = {
    body: Joi.object(body || {}).required(),
    params: Joi.object(params || {}).required(),
    query: Joi.object(query || {}).required(),
  }
  return async (req, res, next) => {
    for (let prop of ['body', 'query', 'params']) {
      const validator = schema[prop]
      const { value, error } = validator.validate(req[prop], {
        errors: { wrap: { label: '' } },
      })
      if (error) {
        next(new HttpError(StatusCodes.BAD_REQUEST, error.message))
      } else {
        req[prop] = value
      }
    }

    return next()
  }
}
module.exports = validate
