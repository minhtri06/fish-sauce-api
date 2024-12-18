const mongoose = require('mongoose')

const User = require('../models/user.model')
const Province = require('../models/province.model')
const District = require('../models/district.model')
const Commune = require('../models/commune.model')
const location = require('../../data/location.json')
const { connectMongoDb } = require('../db')
const ENV_CONFIG = require('../configs/env.config')
const logger = require('../configs/logger.config')

const initUser = async () => {
  await User.deleteMany()
  await User.create({
    email: ENV_CONFIG.USER.EMAIL,
    password: ENV_CONFIG.USER.PASSWORD,
    name: ENV_CONFIG.USER.NAME,
  })
}

const initLocation = async () => {
  await Promise.all([
    (async () => {
      await Province.deleteMany()
      await Province.insertMany(
        location.province.map(({ name, code }) => ({ name, code })),
      )
    })(),
    (async () => {
      await District.deleteMany()
      await District.insertMany(
        location.district.map(({ name, code, provinceCode }) => ({
          name,
          code,
          provinceCode,
        })),
      )
    })(),
    (async () => {
      await Commune.deleteMany()
      await Commune.insertMany(
        location.commune.map(({ name, code, districtCode }) => ({
          name,
          code,
          districtCode,
        })),
      )
    })(),
  ])
}

const initData = async () => {
  await connectMongoDb()

  logger.info('🍂 Init data start')

  await initUser()
  logger.info('🍃 Init user successfully')
  await initLocation()
  logger.info('🍃 Init location successfully')

  logger.info('🍂 Init data done')
  await mongoose.connection.close()
}

initData().catch((error) => {
  logger.error(error)
})
