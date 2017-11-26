const repos = require('./repos')
const initOptions = {
  extend(obj) {
    obj.events = new repos.Events(obj)
  }
}
const pgp = require('pg-promise')(initOptions)
const db = pgp(process.env.DATABASE_URL)

module.exports = db