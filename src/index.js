const app = require('./app')
const ENV_CONFIG = require('./configs/env.config')
const logger = require('./configs/logger.config')
const { connectMongoDb } = require('./db')

let server = undefined
const start = async () => {
  try {
    // connect databases
    await connectMongoDb()
    logger.info('🍃 Connect mongodb successfully')

    server = app.listen(ENV_CONFIG.PORT, () => {
      logger.info('🍂 Server is running on port ' + ENV_CONFIG.PORT)
    })
  } catch (error) {
    logger.error(error)
  }
}

start()

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)
process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
