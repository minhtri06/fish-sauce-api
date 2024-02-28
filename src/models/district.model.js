const mongoose = require('mongoose')
const { MODEL_NAMES } = require('../common/constants')

const districtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    code: { type: Number, unique: true, required: true },

    provinceCode: { type: Number, required: true },
  },

  { timestamps: true, optimisticConcurrency: true },
)

const District = mongoose.model(MODEL_NAMES.DISTRICT, districtSchema)

module.exports = District
