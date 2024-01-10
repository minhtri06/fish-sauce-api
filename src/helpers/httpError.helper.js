class HttpError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {{type?: string}} attachFields
   */
  constructor(statusCode, message, { type } = {}) {
    super(message)
    this.statusCode = statusCode
    this.type = type
  }
}

module.exports = HttpError
