const mongoose = require('mongoose')

const ENV_CONFIG = require('../configs/env.config')
const User = require('../models/user.model')

const connectMongoDb = async () => {
  await mongoose.connect(ENV_CONFIG.MONGODB.URL)
}

const setupUser = async () => {
  const user = await User.findOne({ email: 'admin@email.com' })
  if (!user) {
    await User.create({
      email: 'admin@email.com',
      password: 'Abc@12345',
      name: 'Nguyen Van A',
    })
  }
}

module.exports = { connectMongoDb, setupUser }
