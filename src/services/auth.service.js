const {
  StatusCodes: { BAD_REQUEST, FORBIDDEN, UNAUTHORIZED },
  StatusCodes,
} = require('http-status-codes')
const bcrypt = require('bcryptjs')
const moment = require('moment')

const envConfig = require('../configs/env.config')
const {
  TOKEN_TYPES: { ACCESS_TOKEN, REFRESH_TOKEN },
} = require('../constants')
const User = require('../models/user.model')
const userService = require('./user.service')
const tokenService = require('./token.service')
const { HttpError } = require('../helpers')
const Token = require('../models/token.model')

/**
 * @typedef {InstanceType<import('../models/User')>} user
 *
 * @typedef {InstanceType<import('../models/Token')>} token
 */

/**
 * Compare raw password with hashed password
 * @param {string} hashedPassword
 * @param {string} rawPassword
 * @returns
 */
const comparePassword = async (hashedPassword, rawPassword) => {
  return await bcrypt.compare(rawPassword, hashedPassword)
}

/**
 * Login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user, authTokens }>}
 */
const localLogin = async (email, password) => {
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
  refreshTokenDoc.isRevoked = true
  await refreshTokenDoc.save()
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
    throw new HttpError(
      StatusCodes.UNAUTHORIZED,
      'Access token has not expired',
    )
  }
  if (refreshPayload.exp < now) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Refresh token has expired')
  }

  if (refreshPayload.sub !== accessPayload.sub) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token')
  }

  const refreshTokenDoc = await Token.findOne({
    body: refreshToken,
    type: REFRESH_TOKEN,
  })

  if (refreshTokenDoc.isBlacklisted) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized')
  }

  const userId = refreshPayload.sub
  if (refreshTokenDoc.isUsed || refreshTokenDoc.isRevoked) {
    // If refresh token is already used or revoked => blacklist this token and all usable refresh tokens of that user
    refreshTokenDoc.isBlacklisted = true
    await refreshTokenDoc.save()
    await tokenService.blackListAUser(userId)
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized')
  }

  refreshTokenDoc.isUsed = true
  await refreshTokenDoc.save()
  return tokenService.createAuthTokens(userId)
}

module.exports = {
  localLogin,
  logout,
  refreshAuthTokens,
}
