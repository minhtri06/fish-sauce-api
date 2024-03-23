const app = require('./app')
const ENV_CONFIG = require('./configs/env.config')
const logger = require('./configs/logger.config')
const { connectMongoDb } = require('./db')

const start = async () => {
  try {
    // connect databases
    await connectMongoDb()
    logger.info('🍃 Connect mongodb successfully')

    app.listen(ENV_CONFIG.PORT, () => {
      logger.info('🍂 Server is running on port ' + ENV_CONFIG.PORT)
    })
  } catch (error) {
    logger.error(error)
  }
}

start()
