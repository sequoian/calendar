const Hashids = require('hashids')
const padding = 20
const hashids = new Hashids(process.env.HASHIDS_SALT, padding)

class PassResetModel {
  constructor(db) {
    this.db = db
  }

  initReset(userId) {
    return this.db.one(`
      INSERT INTO password_reset (user_id) 
      VALUES ($1) RETURNING *
    `, userId)
      .then(result => {
        result.id = hashids.encode(result.id)
        return result
      })
  }

  findById(id) {
    const decoded = hashids.decode(id)[0]
    return this.db.oneOrNone(`
      SELECT * FROM password_reset WHERE id = $1
    `, decoded)
      .then(result => {
        if (result)
          result.id = id
        return result
      })
  }

  clearById(id) {
    const decoded = hashids.decode(id)[0]
    return this.db.result(`
      DELETE FROM password_reset WHERE id = $1
    `, decoded, result => result.rowCount)
  }

  clearTable() {
    return this.db.none('TRUNCATE TABLE password_reset CASCADE')
  }
}

module.exports = PassResetModel