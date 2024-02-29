const mongoose = require('mongoose')

const { MODEL_NAMES, INVOICE_STATUSES, PAYMENT_METHODS } = require('../common/constants')
const { toJSONPlugin, convertErrorPlugin, paginatePlugin } = require('./plugins')
const { isUniqueArray } = require('../utils')

const invoiceSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: MODEL_NAMES.PRODUCT,
            required: true,
          },
          name: { type: String, required: true },
          price: { type: Number, min: 0, required: true },
          discount: { type: Number, min: 0, default: 0, required: true },
          quantity: { type: Number, min: 1, required: true },
        },
      ],
      validate: function (products) {
        if (products.length === 0) {
          throw new Error('Invoice cannot have 0 products')
        }
        const productIds = products.map((p) => p.product.toString())
        if (!isUniqueArray(productIds)) {
          throw new Error('Duplicate product id')
        }
      },
      required: true,
    },

    customerName: { type: String, trim: true, required: true },

    phoneNumber: { type: String, trim: true, required: true },

    email: { type: String },

    province: { type: String, required: true },

    provinceCode: { type: Number, required: true },

    district: { type: String, required: true },

    districtCode: { type: Number, required: true },

    commune: { type: String, required: true },

    communeCode: { type: Number, required: true },

    address: { type: String, required: true },

    totalPrice: { type: Number, min: 0, required: true },

    paymentMethod: { type: String, enum: Object.values(PAYMENT_METHODS), required: true },

    status: {
      type: String,
      enum: Object.values(INVOICE_STATUSES),
      validate: function (status) {
        const invoice = this
        if (invoice.paymentMethod === PAYMENT_METHODS.COD) {
          if (status === INVOICE_STATUSES.WAITING_FOR_PAYMENT) {
            throw new Error(`Invalid invoice status (${status}) in COD invoice`)
          }
        }
      },
      required: true,
    },
  },

  {
    timestamps: true,
    optimisticConcurrency: true,
  },
)

invoiceSchema.plugin(toJSONPlugin)
invoiceSchema.plugin(convertErrorPlugin)
invoiceSchema.plugin(paginatePlugin)

const Invoice = mongoose.model(MODEL_NAMES.INVOICE, invoiceSchema)

module.exports = Invoice
