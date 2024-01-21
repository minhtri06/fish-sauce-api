const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Joi = require('joi')

const { toJSONPlugin, convertErrorPlugin, paginatePlugin } = require('./plugins')
const { MODEL_NAMES } = require('../constants')

const emailValidator = Joi.string().email().required()

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },

    email: {
      type: String,
      unique: true,
      validate: function (email) {
        if (emailValidator.validate(email).error) {
          throw new Error('Invalid email')
        }
      },
      required: true,
    },

    password: {
      type: String,
      minLength: 6,
      maxLength: 50,
      validate: (password) => {
        if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number')
        }
      },
      required: true,
    },
  },

  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.password = undefined
      },
    },
  },
)

userSchema.plugin(toJSONPlugin)
userSchema.plugin(convertErrorPlugin)
userSchema.plugin(paginatePlugin)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this
  return bcrypt.compare(password, user.password)
}

const User = mongoose.model(MODEL_NAMES.USER, userSchema)

module.exports = User
