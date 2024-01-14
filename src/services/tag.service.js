const { StatusCodes } = require('http-status-codes')

const { HttpError } = require('../helpers')
const Tag = require('../models/tag.model')
const { pick } = require('../utils')
const Product = require('../models/product.model')

/**
 * Create tag
 * @param {{ name: string }} body
 * @returns {Promise<InstanceType<Tag>>}
 */
const createTag = async (body) => {
  body = pick(body, 'name')
  const tag = await Tag.create(body)
  return tag
}

/**
 * Get all tags
 * @returns {Promise<InstanceType<Tag>[]>}
 */
const getAllTags = async () => {
  const tags = await Tag.find()
  return tags
}

/**
 * Update tag by id
 * @param {string} tagId
 * @param {{ name: string }} body
 * @returns {Promise<InstanceType<Tag>>}
 */
const updateTagById = async (tagId, body) => {
  const tag = await Tag.findById(tagId)
  if (!tag) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Tag not found')
  }
  body = pick(body, 'name')
  Object.assign(tag, body)
  await tag.save()
  return tag
}

const deleteTagById = async (tagId) => {
  const [tag, productCount] = await Promise.all([
    Tag.findById(tagId),
    Product.countDocuments({ tags: tagId }),
  ])
  if (!tag) {
    return
  }
  if (productCount !== 0) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'Cannot delete because there are product with this tag',
      { type: 'tag-has-product' },
    )
  }
  await tag.deleteOne()
}

module.exports = {
  createTag,
  getAllTags,
  updateTagById,
  deleteTagById,
}
