const mongoose = require('mongoose')
const { MODEL_NAMES } = require('../common/constants')

const provinceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    code: { type: Number, unique: true, required: true },
  },

  { timestamps: true, optimisticConcurrency: true },
)

const Province = mongoose.model(MODEL_NAMES.PROVINCE, provinceSchema)

module.exports = Province
