const { StatusCodes } = require('http-status-codes')

const authService = require('../services/auth.service')

/** @typedef {import('express').RequestHandler} controller */

/** @type {controller} */
const login = async (req, res) => {
  const { email, password } = req.body
  const { user, authTokens } = await authService.login(email, password)
  return res.json({ user, authTokens })
}

/** @type {controller} */
const logout = async (req, res) => {
  await authService.logout(req.body.refreshToken)
  return res.status(StatusCodes.NO_CONTENT).send()
}

/** @type {controller} */
const refreshTokens = async (req, res) => {
  const { accessToken, refreshToken } = req.body
  const authTokens = await authService.refreshAuthTokens(accessToken, refreshToken)
  return res.json({ authTokens })
}

module.exports = {
  login,
  logout,
  refreshTokens,
}
