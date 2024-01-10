const ENV_CONFIG = require('../configs/env.config')
const { HttpError } = require('../helpers')
const { StatusCodes } = require('http-status-codes')

/** @type {import('express').ErrorRequestHandler} */
const handleError = async (err, req, res, next) => {
  const isOnProduction = ENV_CONFIG.NODE_ENV === 'prod'

  if (req.file) {
    // TODO: Handle delete file
  }
  if (req.files) {
    // TODO: Handle delete files
  }

  if (err instanceof HttpError) {
    if (isOnProduction) {
      const { message, statusCode, type } = err

      if (statusCode === StatusCodes.UNAUTHORIZED) {
        return res.status(statusCode).json({ message: 'Unauthorized' })
      }

      if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
        return res.status(statusCode).json({ message: 'Something went wrong' })
      }

      return res.status(statusCode).json({ message, type })
    } else {
      console.log(err)
      const { message, statusCode, type } = err
      return res.status(statusCode).json({ message, type })
    }
  }

  if (ENV_CONFIG.NODE_ENV !== 'prod') {
    console.log(err)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message })
  } else {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' })
  }
}

module.exports = handleError
