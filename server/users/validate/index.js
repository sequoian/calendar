module.exports = {
  signup: require('./signup'),
  login: require('./login'),
  updateUser: require('./update').validateUpdate,
  updatePassword: require('./update').validatePasswordUpdate
}