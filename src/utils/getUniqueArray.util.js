/**
 * Get unique array
 * @param {any[]} array
 * @returns {any[]}
 */
const getUniqueArray = (array) => {
  return [...new Set(array)]
}

module.exports = getUniqueArray
