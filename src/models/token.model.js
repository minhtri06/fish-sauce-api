const mongoose = require('mongoose')

const { TOKEN_TYPES, MODEL_NAMES } = require('../common/constants')
const { toJSONPlugin } = require('./plugins')

const tokenSchema = new mongoose.Schema(
  {
    body: { type: String, index: true, required: true },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true,
    },

    type: { type: String, enum: Object.values(TOKEN_TYPES), required: true },

    expires: { type: Date, required: true },

    isRevoked: { type: Boolean },

    isUsed: { type: Boolean },

    isBlacklisted: {
      type: Boolean,
      required: function () {
        return this.type === TOKEN_TYPES.REFRESH_TOKEN
      },
    },
  },

  { timestamps: true },
)

const Token = mongoose.model(MODEL_NAMES.TOKEN, tokenSchema)

module.exports = Token
