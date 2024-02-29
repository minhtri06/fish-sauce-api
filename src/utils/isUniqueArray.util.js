const getUniqueArray = require('./getUniqueArray.util')

/**
 * Check array uniqueness
 * @param {any[]} arr
 * @returns {boolean}
 */
const isUniqueArray = (arr) => {
  const set = new Set()
  for (let i = 0; i < arr.length; i++) {
    if (set.has(arr[i])) {
      return false
    }
    set.add(arr[i])
  }
  return true
}

module.exports = isUniqueArray
