const util = require('util')
const multer = require('multer')
const { StatusCodes } = require('http-status-codes')

const { HttpError } = require('../helpers')
const { imageStorage, imageFilter, imageLimits } = require('../configs/multer.config')

const imageUploader = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: imageLimits,
})

/** @typedef {import('express').RequestHandler} middleware */

/**
 * Return middlewares for upload image
 * @param {string} fieldName
 * @param {{ required: boolean }} param1
 * @returns {middleware[]}
 */
const uploadImage = (fieldName, { required } = { required: true }) => {
  return [
    util.promisify(imageUploader.single(fieldName)),
    (req, res, next) => {
      if (!req.file) {
        if (required) {
          throw new HttpError(StatusCodes.BAD_REQUEST, `${fieldName} is required`)
        }
      }

      const { _jsonData } = req.body
      if (_jsonData && typeof _jsonData === 'string') {
        req.body = JSON.parse(_jsonData)
      }

      return next()
    },
  ]
}

/**
 * Return middlewares for upload many images
 * @param {string} fieldName
 * @param {{ maxCount: number, required: boolean }} param1
 * @returns {middleware[]}
 */
const uploadManyImages = (fieldName, { maxCount = 100, required = true } = {}) => {
  return [
    util.promisify(imageUploader.array(fieldName, maxCount)),
    (req, res, next) => {
      if (!req.files || req.files.length === 0) {
        if (required) {
          throw new HttpError(StatusCodes.BAD_REQUEST, `'${fieldName}' is required`)
        }
      }

      const { _jsonData } = req.body
      if (_jsonData && typeof _jsonData === 'string') {
        req.body = JSON.parse(_jsonData)
      }

      return next()
    },
  ]
}

module.exports = {
  uploadImage,
  uploadManyImages,
}
