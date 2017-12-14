const UserModel = require('../users/models')
const initOptions = {
  extend(obj) {
    obj.users = new UserModel(obj)
  }
}
const pgp = require('pg-promise')(initOptions)
const db = pgp(process.env.DATABASE_URL)

module.exports = db