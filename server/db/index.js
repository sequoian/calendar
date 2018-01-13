const UserModel = require('../users/models')
const EventModel = require('../events/models')
const PassResetModel = require('../users/models/pass-reset')
const initOptions = {
  extend(obj) {
    obj.users = new UserModel(obj)
    obj.events = new EventModel(obj)
    obj.passreset = new PassResetModel(obj)
  }
}
const pgp = require('pg-promise')(initOptions)
const db = pgp(process.env.DATABASE_URL)

module.exports = db