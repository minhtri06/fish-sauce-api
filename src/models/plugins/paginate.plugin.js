const ENV_CONFIG = require('../../configs/env.config')

const paginatePlugin = (schema) => {
  schema.statics.paginate = async function (
    filter = {},
    {
      sort,
      page = 1,
      limit = ENV_CONFIG.DEFAULT_PAGE_LIMIT,
      skip = 0,
      select,
      populate,
      lean,
      checkPaginate,
    } = {},
  ) {
    const query = this.find(filter)

    if (sort) {
      query.sort(sort)
    }
    if (select) {
      query.select(select)
    }
    if (populate) {
      query.populate(populate)
    }
    if (lean) {
      query.lean()
    }

    skip = skip + (page - 1) * limit

    query.skip(skip).limit(limit)

    if (checkPaginate) {
      const [data, totalRecords] = await Promise.all([
        query.exec(),
        this.countDocuments(filter).exec(),
      ])
      return {
        page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        data,
      }
    }
    const data = await query.exec()
    return { data }
  }
}

module.exports = paginatePlugin
