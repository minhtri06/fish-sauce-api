const authService = require('../services/auth.service')

/** @type {import('express').RequestHandler} */
const login = async (req, res) => {
  const { email, password } = req.body
  const { user, authTokens } = await authService.login(email, password)

  return res.json({ user, authTokens })
}

module.exports = { login }
