const jwt = require('jsonwebtoken')
const moment = require('moment')
const { StatusCodes } = require('http-status-codes')

const Token = require('../models/token.model')
const { HttpError } = require('../helpers')
const { ACCESS_TOKEN, REFRESH_TOKEN } = require('../constants').TOKEN_TYPES
const {
  JWT: { SECRET, ACCESS_EXPIRATION_MINUTES, REFRESH_EXPIRATION_DAYS },
} = require('../configs/env.config')

/**
 * @typedef {InstanceType<Token>} token
 */

/**
 * Generate a token
 * @param {string} userId
 * @param {moment.Moment} expires
 * @param {string} type
 * @returns {string}
 */
const generateToken = (userId, expires, type) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  }
  return jwt.sign(payload, SECRET)
}

/**
 * Generate a new access token
 * @param {string} userId
 * @returns {string}
 */
const generateAccessToken = (userId) => {
  const expires = moment().add(ACCESS_EXPIRATION_MINUTES, 'minutes')
  return generateToken(userId, expires, ACCESS_TOKEN)
}

/**
 * Generate a refresh token and save it into db
 * @param {string} userId
 * @returns {Promise<token>}
 */
const createRefreshToken = async (userId) => {
  const expires = moment().add(REFRESH_EXPIRATION_DAYS, 'days')
  const token = generateToken(userId, expires, REFRESH_TOKEN)
  return await Token.create({
    body: token,
    user: userId,
    type: REFRESH_TOKEN,
    expires: expires.toDate(),
    isRevoked: false,
    isUsed: false,
    isBlacklisted: false,
  })
}

/**
 * Generate access token and refresh token, save refresh token into db
 * @param {string} userId
 * @returns {Promise<{ accessToken, refreshToken }>}
 */
const createAuthTokens = async (userId) => {
  const accessToken = generateAccessToken(userId)
  const refreshTokenDoc = await createRefreshToken(userId)
  return {
    accessToken,
    refreshToken: refreshTokenDoc.body,
  }
}

/**
 * Verify a token and return token's payload
 * @param {string} token
 * @param {ACCESS_TOKEN | REFRESH_TOKEN} type
 * @param {{ ignoreExpiration?: boolean }} options
 * @returns {{ sub, iat, exp, type }}
 */
const verifyToken = (token, type, options = {}) => {
  try {
    const payload = jwt.verify(token, SECRET, options)
    if (payload.type !== type) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token')
    }
    return payload
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, error.message)
    }
    throw error
  }
}

/**
 * Blacklist all usable tokens of a user
 * @param {string} userId
 */
const blackListAUser = async (userId) => {
  await Token.updateMany(
    { user: userId, type: REFRESH_TOKEN, isUsed: false, isRevoked: false },
    { isBlacklisted: true },
  )
}

module.exports = {
  generateToken,
  generateAccessToken,
  createRefreshToken,
  createAuthTokens,
  verifyToken,
  blackListAUser,
}
