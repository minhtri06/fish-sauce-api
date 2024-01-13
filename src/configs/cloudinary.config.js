const { v2: cloudinary } = require('cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const ENV_CONFIG = require('./env.config')

cloudinary.config({
  cloud_name: ENV_CONFIG.CLOUDINARY.NAME,
  api_key: ENV_CONFIG.CLOUDINARY.API_KEY,
  api_secret: ENV_CONFIG.CLOUDINARY.API_SECRET,
})

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: ENV_CONFIG.CLOUDINARY.FOLDER,
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
})

module.exports = {
  cloudinary,
  imageStorage,
}
