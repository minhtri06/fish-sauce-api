const { StatusCodes } = require('http-status-codes')

const { HttpError } = require('../helpers')
const { cloudinary } = require('../configs/cloudinary.config')
const ENV_CONFIG = require('../configs/env.config')

const deleteFile = (file) => {
  if (file.storageName === 'cloudinary') {
    cloudinary.uploader.destroy(file.filename)
  }
}

/** @type {import('express').ErrorRequestHandler} */
const handleError = async (err, req, res, next) => {
  const isOnProduction = ENV_CONFIG.NODE_ENV === 'prod'

  if (req.file) {
    deleteFile(req.file)
  }
  if (req.files) {
    if (req.files instanceof Array) {
      req.files.forEach((file) => {
        deleteFile(file)
      })
    }
  }

  if (err instanceof HttpError) {
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
      console.log(err)
      return res.status(statusCode).json({ message, type, details, duplicateKeys })
    }
  }

  if (isOnProduction) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' })
  } else {
    console.log(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }
}

module.exports = handleError
