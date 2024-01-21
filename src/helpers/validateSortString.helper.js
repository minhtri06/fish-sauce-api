const { StatusCodes } = require('http-status-codes')

const httpError = require('./httpError.helper')

/**
 * Convert sort string to object that mongoose can understand
 * @param {string} sortString Ex: name -price
 * @param {string[]} allowedFields Ex: ['name', 'price']
 */
const validateSortString = (sortString, allowedFields) => {
  for (const fieldOrder of sortString.split(' ')) {
    // remove prefix '-' if has any
    const field = fieldOrder[0] === '-' ? fieldOrder.slice(1) : fieldOrder
    if (!allowedFields.includes(field)) {
      throw new httpError(StatusCodes.BAD_REQUEST, `'${field}' is not allowed in sort option`)
    }
  }
}

module.exports = validateSortString
