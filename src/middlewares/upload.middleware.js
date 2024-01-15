const util = require('util')
const multer = require('multer')
const { StatusCodes } = require('http-status-codes')

const { HttpError } = require('../helpers')
const { imageStorage } = require('../configs/cloudinary.config')

const imageUploader = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    const [type, extension] = file.mimetype.split('/')
    if (type !== 'image') {
      cb(new HttpError(StatusCodes.BAD_REQUEST, 'Invalid image'))
    } else {
      file.extension = extension
      cb(null, true)
    }
  },
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
      if (req.file) {
        req.file.storageName = 'cloudinary'
      } else {
        if (required) {
          throw new HttpError(StatusCodes.BAD_REQUEST, `${fieldName} is required`)
        }
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
      if (req.files && req.files.length !== 0) {
        req.files.forEach((file) => (file.storageName = 'cloudinary'))
      } else {
        if (required) {
          throw new HttpError(StatusCodes.BAD_REQUEST, `'${fieldName}' is required`)
        }
      }
      return next()
    },
  ]
}

module.exports = {
  uploadImage,
  uploadManyImages,
}
