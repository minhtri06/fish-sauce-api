const multer = require('multer')

const { IMAGES_FULL_PATH } = require('../common/constants')
const imageStorageService = require('../services/image-storage.service')

const imageStorage = multer.diskStorage({
  destination: IMAGES_FULL_PATH,
  filename: function (req, file, cb) {
    const [type, extension] = file.mimetype.split('/')
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension)
  },
})

const imageFilter = (req, file, cb) => {
  const [type, extension] = file.mimetype.split('/')
  if (type !== 'image') {
    cb(new HttpError(StatusCodes.BAD_REQUEST, 'Invalid image'))
  } else {
    file.extension = extension
    file.remove = function () {
      imageStorageService.deleteImage(this.filename)
    }
    cb(null, true)
  }
}

const imageLimits = { fileSize: 20 * 1024 * 1024 }

module.exports = {
  imageStorage,
  imageFilter,
  imageLimits,
}
