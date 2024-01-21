class HttpError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {{ type?: string, details?: string, duplicateKeys: string[] }} attachFields
   */
  constructor(statusCode, message, { type, details, duplicateKeys } = {}) {
    super(message)
    this.statusCode = statusCode
    this.type = type
    this.details = details
    this.duplicateKeys = duplicateKeys
  }
}

module.exports = HttpError
