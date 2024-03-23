const morgan = require('morgan')

const ENV_CONFIG = require('./env.config')
const logger = require('./logger.config')

const isProduction = ENV_CONFIG.NODE_ENV === 'prod'

const getIpFormat = () => (isProduction ? ':remote-addr - ' : '')
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms\n:stack`

// error is assigned in error handler middleware
morgan.token('stack', (req, res) => res.locals.error?.stack || '')

const morganSuccessHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
})

const morganErrorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
})

module.exports = {
  morganSuccessHandler,
  morganErrorHandler,
}
