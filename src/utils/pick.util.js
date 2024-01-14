/**
 * Pick fields from object
 * @template T
 * @param {T} obj
 * @param  {...string} props
 * @returns {Partial<T>}
 */
const pick = (obj, ...props) => {
  const ret = {}
  let prop
  for (prop of Object.getOwnPropertyNames(obj)) {
    if (props.includes(prop)) {
      ret[prop] = obj[prop]
    }
  }
  return ret
}

module.exports = pick
