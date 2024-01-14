const mongoose = require('mongoose')
const { toJSONPlugin, convertErrorPlugin } = require('./plugins')
const { MODEL_NAMES } = require('../constants')

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, unique: true, required: true },
  },

  { timestamps: true },
)

tagSchema.plugin(toJSONPlugin)
tagSchema.plugin(convertErrorPlugin)

const Tag = mongoose.model(MODEL_NAMES.TAG, tagSchema)

module.exports = Tag
