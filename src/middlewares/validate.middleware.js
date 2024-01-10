const Joi = require('joi')
const { HttpError } = require('../helpers')
const { StatusCodes } = require('http-status-codes')

const emptyObj = Joi.object({})

const validate = (schema) => async (req, res, next) => {
  for (let prop of ['body', 'query', 'params']) {
    const validator = schema[prop] || emptyObj
    const { value, error } = validator.required().validate(req[prop], {
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

module.exports = validate
