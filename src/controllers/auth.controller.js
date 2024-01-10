const { StatusCodes } = require('http-status-codes')

const authService = require('../services/auth.service')

/** @type {import('express').RequestHandler} */
const login = async (req, res) => {
  const { email, password } = req.body
  const { user, authTokens } = await authService.login(email, password)

  return res.json({ user, authTokens })
}

/** @type {import('express').RequestHandler} */
const logout = async (req, res) => {
  await authService.logout(req.body.refreshToken)

  return res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = {
  login,
  logout,
}
