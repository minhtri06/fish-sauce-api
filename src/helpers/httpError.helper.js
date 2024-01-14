class HttpError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {{ type?: string, details?: string }} attachFields
   */
  constructor(statusCode, message, { type, details } = {}) {
    super(message)
    this.statusCode = statusCode
    this.type = type
    this.details = details
  }
}

module.exports = HttpError
