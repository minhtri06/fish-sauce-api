const mongoose = require('mongoose')

const { toJSONPlugin, convertErrorPlugin, paginatePlugin } = require('./plugins')
const { MODEL_NAMES } = require('../constants')

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, unique: true, required: true },

    image: { type: String, required: true },
  },

  { timestamps: true },
)

categorySchema.plugin(toJSONPlugin)
categorySchema.plugin(convertErrorPlugin)
categorySchema.plugin(paginatePlugin)

const Category = mongoose.model(MODEL_NAMES.CATEGORY, categorySchema)

module.exports = Category
