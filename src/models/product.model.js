const mongoose = require('mongoose')

const { MODEL_NAMES } = require('../constants')
const { toJSONPlugin } = require('./plugins')

const productSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },

    slug: { type: String, trim: true, required: true },

    description: { type: String, required: true },

    price: { type: Number, required: true, min: 0 },

    discount: { type: Number, required: true, min: 0 },

    isNew: { type: Boolean, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.CATEGORY,
      required: true,
    },

    images: { type: [String] },

    tags: { type: [String] },
  },

  { timestamps: true },
)

productSchema.plugin(toJSONPlugin)

const Product = mongoose.model(MODEL_NAMES.PRODUCT, productSchema)

module.exports = Product
