const mongoose = require('mongoose')
const { toJSONPlugin, convertErrorPlugin, paginatePlugin } = require('./plugins')
const { MODEL_NAMES } = require('../constants')

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, unique: true, required: true },
  },

  { timestamps: true },
)

tagSchema.plugin(toJSONPlugin)
tagSchema.plugin(convertErrorPlugin)
tagSchema.plugin(paginatePlugin)

const Tag = mongoose.model(MODEL_NAMES.TAG, tagSchema)

module.exports = Tag
