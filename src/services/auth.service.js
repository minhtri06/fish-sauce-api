const {
  StatusCodes: { BAD_REQUEST, FORBIDDEN, UNAUTHORIZED },
  StatusCodes,
} = require('http-status-codes')
const bcrypt = require('bcryptjs')
const moment = require('moment')

const envConfig = require('../configs/env.config')
const {
  TOKEN_TYPES: { ACCESS_TOKEN, REFRESH_TOKEN },
} = require('../common/constants')
const User = require('../models/user.model')
const tokenService = require('./token.service')
const { HttpError } = require('../helpers')
const Token = require('../models/token.model')

/**
 * @typedef {InstanceType<import('../models/User')>} user
 *
 * @typedef {InstanceType<import('../models/Token')>} token
 */

/**
 * Login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user, authTokens }>}
 */
const login = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Wrong email', {
      type: 'wrong-email-or-password',
    })
  }

  if (!(await user.isPasswordMatch(password))) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Password did not match', {
      type: 'wrong-email-or-password',
    })
  }

  const authTokens = await tokenService.createAuthTokens(user._id)

  return { user, authTokens }
}

/**
 * Logout
 * @param {string} refreshToken
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    body: refreshToken,
    type: REFRESH_TOKEN,
  })
  if (refreshTokenDoc) {
    refreshTokenDoc.isRevoked = true
    await refreshTokenDoc.save()
  }
}

/**
 * Refresh Auth tokens
 * @param {string} accessToken
 * @param {string} refreshToken
 * @returns {Promise<{ accessToken, refreshToken }>}
 */
const refreshAuthTokens = async (accessToken, refreshToken) => {
  // Remove 'Bearer '
  accessToken = accessToken.slice(7)

  const accessPayload = tokenService.verifyToken(accessToken, ACCESS_TOKEN, {
    ignoreExpiration: true,
  })
  const refreshPayload = tokenService.verifyToken(refreshToken, REFRESH_TOKEN, {
    ignoreExpiration: true,
  })

  const now = moment().unix()
  if (accessPayload.exp > now) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Access token has not expired')
  }
  if (refreshPayload.exp < now) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Refresh token has expired')
  }

  if (refreshPayload.sub !== accessPayload.sub) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token')
  }

  const userId = refreshPayload.sub

  const newAuthTokens = await tokenService.createAuthTokens(userId)

  const refreshTokenDoc = await Token.findOneAndUpdate(
    {
      body: refreshToken,
      type: REFRESH_TOKEN,
      isBlacklisted: false,
      isUsed: false,
      isRevoked: false,
    },
    { isUsed: true },
  )
  if (!refreshTokenDoc) {
    await tokenService.blackListAUser(userId)
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized')
  }

  return newAuthTokens
}

module.exports = {
  login,
  logout,
  refreshAuthTokens,
}
