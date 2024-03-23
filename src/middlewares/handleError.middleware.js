const { StatusCodes } = require('http-status-codes')

const { HttpError } = require('../helpers')
const ENV_CONFIG = require('../configs/env.config')

/** @type {import('express').ErrorRequestHandler} */
const handleError = async (err, req, res, next) => {
  const isOnProduction = ENV_CONFIG.NODE_ENV === 'prod'

  if (req.file) {
    if (req.file.remove) {
      req.file.remove()
    }
  }
  if (req.files) {
    if (req.files instanceof Array) {
      req.files.forEach((file) => {
        if (file.remove) {
          file.remove()
        }
      })
    }
  }

  if (err instanceof HttpError) {
    res.locals.error = err

    const { message, statusCode, type, details, duplicateKeys } = err

    if (isOnProduction) {
      if (statusCode === StatusCodes.UNAUTHORIZED) {
        return res.status(statusCode).json({ message: 'Unauthorized' })
      }

      if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
        return res.status(statusCode).json({ message: 'Something went wrong' })
      }

      return res.status(statusCode).json({ message, type, details, duplicateKeys })
    } else {
      return res.status(statusCode).json({ message, type, details, duplicateKeys })
    }
  }

  if (isOnProduction) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' })
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

module.exports = handleError
