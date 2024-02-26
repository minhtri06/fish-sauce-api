require('express-async-errors')

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const logger = require('morgan')

const ENV_CONFIG = require('./configs/env.config')
const { notfound, handleError } = require('./middlewares')
const router = require('./routes')

const app = express()

// TODO: config rate-limit.

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

app.use('/api/v1', router)

app.use(notfound)
app.use(handleError)

module.exports = app
