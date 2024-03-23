const winston = require('winston')
const ENV_CONFIG = require('./env.config')

const isProduction = ENV_CONFIG.NODE_ENV === 'prod'

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug', // only log when level >= 'info'/'debug'
  format: winston.format.combine(
    enumerateErrorFormat(),
    isProduction ? winston.format.uncolorize() : winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`
    }),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
})

module.exports = logger
