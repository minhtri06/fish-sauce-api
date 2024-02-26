const mongoose = require('mongoose')

const { MODEL_NAMES, INVOICE_STATUSES, PAYMENT_METHODS } = require('../common/constants')

const invoiceSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
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
      },
      required: true,
    },

    customerName: { type: String, trim: true, required: true },

    totalPrice: { type: Number, min: 0, required: true },

    phoneNumber: { type: String, required: true },

    province: { type: String, required: true },

    district: { type: String, required: true },

    address: { type: String, required: true },

    email: { type: String },

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

  { timestamps: true, optimisticConcurrency: true },
)

const Invoice = mongoose.model(MODEL_NAMES.INVOICE, invoiceSchema)
