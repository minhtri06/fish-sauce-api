const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const { HttpError } = require('../helpers')
const ENV_CONFIG = require('../configs/env.config')
const userService = require('../services/user.service')

/**
 *
 * @param {*} param0
 * @returns {import('express').RequestHandler}
 */
const auth = ({ isRequired = true } = {}) => {
  return async (req, res, next) => {
    let accessToken = req.headers['authorization']
    accessToken = accessToken?.split(' ')[1]

    if (!accessToken) {
      if (!isRequired) {
        return next()
      } else {
        return next(new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized'))
      }
    }

    let payload
    try {
      payload = jwt.verify(accessToken, ENV_CONFIG.JWT.SECRET)
    } catch (error) {
      if (!isRequired) {
        return next()
      } else {
        return next(new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized'))
      }
    }

    req.user = await userService.getUserById(payload.sub)
    return next()
  }
}

module.exports = auth
