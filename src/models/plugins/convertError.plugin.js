const mongoose = require('mongoose')
const { StatusCodes } = require('http-status-codes')

const { HttpError } = require('../../helpers')

const convertErrorPlugin = (schema) => {
  schema.post('save', function (error, doc, next) {
    // mongoose validation error
    if (error instanceof mongoose.Error.ValidationError) {
      return next(
        new HttpError(StatusCodes.BAD_REQUEST, 'Validation failed', {
          details: Object.keys(error.errors).map((key) => ({
            path: error.errors[key].path,
            message: error.errors[key].message,
          })),
        }),
      )
    }

    // mongodb duplicate error
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      const keyValue = error.keyValue
      const duplicateKeys = Object.keys(keyValue)
      const message = duplicateKeys
        .map((key) => `${key} '${keyValue[key]}' already exists`)
        .join(', ')
      return next(
        new HttpError(StatusCodes.BAD_REQUEST, message, {
          type: 'duplicate-key',
          duplicateKeys,
        }),
      )
    }

    next(error)
  })
}

module.exports = convertErrorPlugin
