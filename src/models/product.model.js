const mongoose = require('mongoose')

const { MODEL_NAMES, PRODUCT_STATUSES } = require('../common/constants')
const { toJSONPlugin, convertErrorPlugin, paginatePlugin } = require('./plugins')

const productSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, unique: true, required: true },

    description: { type: String, required: true },

    price: { type: Number, min: 0, required: true },

    discount: {
      type: Number,
      min: 0,
      default: 0,
      validate: function () {
        if (this.discount > this.price) {
          throw new Error('Discount cannot greater than price')
        }
      },
      required: true,
    },

    quantity: { type: Number, min: 0, default: 0, required: true },

    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUSES),
      default: PRODUCT_STATUSES.ACTIVE,
      required: true,
    },

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
    },
  },

  {
    timestamps: true,
    optimisticConcurrency: true,
  },
)

// enable full-text search
productSchema.index({ name: 'text' })

productSchema.plugin(toJSONPlugin)
productSchema.plugin(convertErrorPlugin)
productSchema.plugin(paginatePlugin)

const Product = mongoose.model(MODEL_NAMES.PRODUCT, productSchema)

module.exports = Product
