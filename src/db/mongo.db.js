const mongoose = require('mongoose')

const ENV_CONFIG = require('../configs/env.config')

const connectMongoDb = async () => {
  await mongoose.connect(ENV_CONFIG.MONGODB.URL)
}

module.exports = { connectMongoDb }
