require('express-async-errors')

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const logger = require('morgan')
const rateLimit = require('express-rate-limit')

const ENV_CONFIG = require('./configs/env.config')
const { notfound, handleError } = require('./middlewares')
const router = require('./routes')
const { PUBLIC_FULL_PATH } = require('./common/constants')

const app = express()

app.use(helmet())

app.use(
  cors({
    origin: [ENV_CONFIG.CLIENT_URL, 'https://fish-sauce-next.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  }),
)

app.use(logger('dev'))

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
