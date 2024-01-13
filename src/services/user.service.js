const User = require('../models/user.model')

/**
 * Get user by id, return null if not found
 * @param {string} userId
 * @returns {Promise<InstanceType<User> | null>}
 */
const getUserById = async (userId) => {
  return User.findById(userId)
}

module.exports = {
  getUserById,
}
