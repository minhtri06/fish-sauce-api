const toJSONPlugin = (schema) => {
  const options = schema.options
  options.toJSON = options.toJSON || {}
  const transform = options.toJSON.transform

  options.toJSON.transform = function (doc, ret, options) {
    ret.id = ret._id

    delete ret._id
    delete ret.__v

    if (typeof transform === 'function') {
      transform(doc, ret, options)
    }
  }
}

module.exports = toJSONPlugin
