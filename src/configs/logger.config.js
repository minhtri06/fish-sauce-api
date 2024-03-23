const winston = require('winston')
require('winston-daily-rotate-file')

const ENV_CONFIG = require('./env.config')
const { LOG_FULL_PATH } = require('../common/constants')

const isProduction = ENV_CONFIG.NODE_ENV === 'prod'

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})

const combineTransport = new winston.transports.DailyRotateFile({
  filename: '%DATE%.log',
  dirname: LOG_FULL_PATH + '/combine',
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
})
const errorTransport = new winston.transports.DailyRotateFile({
  filename: '%DATE%.log',
  dirname: LOG_FULL_PATH + '/error',
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
})

// prevent crash app when winston-daily-rotate-file emitting an error
combineTransport.on('error', (error) => {
  logger.error(error)
})
errorTransport.on('error', (error) => {
  logger.error(error)
})

const prodTransports = [combineTransport, errorTransport]

const devTransports = [new winston.transports.Console()]

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
  transports: isProduction ? prodTransports : devTransports,
})

module.exports = logger
