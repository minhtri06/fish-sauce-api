const fs = require('fs')
const { IMAGES_FULL_PATH } = require('../common/constants')
const logger = require('../configs/logger.config')

const deleteImage = (imageName) => {
  fs.unlink(IMAGES_FULL_PATH + '/' + imageName, (error) => {
    logger.error(error)
  })
}

module.exports = {
  deleteImage,
}
