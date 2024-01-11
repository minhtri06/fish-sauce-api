const mongoose = require('mongoose')

const { MODEL_NAMES } = require('../constants')

const invoiceSchema = new mongoose.Schema({})

const Invoice = mongoose.model(MODEL_NAMES.INVOICE, invoiceSchema)
