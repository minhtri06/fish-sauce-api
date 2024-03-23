require('express-async-errors')

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const ENV_CONFIG = require('./configs/env.config')
const { morganSuccessHandler, morganErrorHandler } = require('./configs/morgan.config')
const { notfound, handleError } = require('./middlewares')
const router = require('./routes')
const { PUBLIC_FULL_PATH } = require('./common/constants')

const app = express()

// enable trust proxy
// because we use nginx as a proxy, we must enable trust proxy
// otherwise the request's ip will always be 127.0.0.1
app.set('trust proxy', 1)

if (ENV_CONFIG.NODE_ENV !== 'test') {
  app.use(morganSuccessHandler)
  app.use(morganErrorHandler)
}

app.use(helmet())

app.use(
  cors({
    origin: [ENV_CONFIG.CLIENT_URL, 'https://fish-sauce-next.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(PUBLIC_FULL_PATH))

const rateLimiter = rateLimit({
  windowMs: ENV_CONFIG.RATE_LIMIT_WINDOW_MINUTE * 60 * 1000,
  limit: ENV_CONFIG.RATE_LIMIT_PER_WINDOW,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many requests, please try again later.',
  },
})
app.use(rateLimiter)

app.use('/api/v1', router)

app.use(notfound)
app.use(handleError)

module.exports = app
