const mongoose = require('mongoose')

const { MODEL_NAMES } = require('../constants')
const { toJSONPlugin, convertErrorPlugin } = require('./plugins')

const productSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, unique: true, required: true },

    description: { type: String },

    price: { type: Number, required: true, min: 0 },

    discount: { type: Number, required: true, min: 0 },

    isNew: { type: Boolean, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.CATEGORY,
      required: true,
    },

    images: {
      type: [String],
      validate(images) {
        if (images.length === 0) {
          throw new Error('Product required at least one image')
        }
      },
    },

    tags: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.TAG }],
      default: [],
    },
  },

  { timestamps: true },
)

productSchema.plugin(toJSONPlugin)
productSchema.plugin(convertErrorPlugin)

const Product = mongoose.model(MODEL_NAMES.PRODUCT, productSchema)

module.exports = Product
