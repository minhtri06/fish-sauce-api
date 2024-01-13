module.exports = {
  auth: require('./auth.middleware'),
  handleError: require('./handleError.middleware'),
  notfound: require('./notfound.middleware'),
  ...require('./upload.middleware'),
  validate: require('./validate.middleware'),
}
