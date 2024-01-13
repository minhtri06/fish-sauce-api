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

const uploadImage = (fieldName, { required } = { required: true }) => {
  return [
    util.promisify(imageUploader.single(fieldName)),
    (req, res, next) => {
      if (req.file) {
        req.file.storageName = 'cloudinary'
      } else {
        if (required) {
          throw new HttpError(
            StatusCodes.BAD_REQUEST,
            `${fieldName} is required`,
          )
        }
      }
      return next()
    },
  ]
}

module.exports = {
  uploadImage,
}
