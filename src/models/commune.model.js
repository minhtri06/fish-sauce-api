const mongoose = require('mongoose')
const { MODEL_NAMES } = require('../common/constants')

const communeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    code: { type: Number, unique: true, required: true },

    districtCode: { type: Number, required: true },
  },

  { timestamps: true, optimisticConcurrency: true },
)

const Commune = mongoose.model(MODEL_NAMES.COMMUNE, communeSchema)

module.exports = Commune
