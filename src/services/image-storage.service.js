const fs = require('fs')
const { IMAGES_FULL_PATH } = require('../common/constants')

const deleteImage = (imageName) => {
  fs.unlink(IMAGES_FULL_PATH + '/' + imageName, (err) => {
    if (err) throw err
  })
}

module.exports = {
  deleteImage,
}
