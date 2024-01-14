const Joi = require('joi')
const { stringId } = require('./custom.validation')

module.exports = {
  createTag: {
    body: {
      name: Joi.string().required(),
    },
  },

  updateTagById: {
    params: {
      tagId: stringId.required(),
    },
    body: {
      name: Joi.string(),
    },
  },

  deleteTagById: {
    params: {
      tagId: stringId.required(),
    },
  },
}
