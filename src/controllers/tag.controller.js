const { StatusCodes } = require('http-status-codes')

const tagService = require('../services/tag.service')

/** @typedef {import('express').RequestHandler} controller */

/** @type {controller} */
const createTag = async (req, res) => {
  const tag = await tagService.createTag(req.body)
  return res.status(StatusCodes.CREATED).json({ tag })
}

/** @type {controller} */
const getAllTag = async (req, res) => {
  const tags = await tagService.getAllTags()
  return res.json({ tags })
}

/** @type {controller} */
const updateTagById = async (req, res) => {
  const { tagId } = req.params
  const tag = await tagService.updateTagById(tagId, req.body)
  return res.json({ tag })
}

/** @type {controller} */
const deleteTagById = async (req, res) => {
  const { tagId } = req.params
  await tagService.deleteTagById(tagId)
  return res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = { createTag, getAllTag, updateTagById, deleteTagById }
