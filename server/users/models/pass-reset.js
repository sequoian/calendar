class PassResetModel {
  constructor(db) {
    this.db = db
  }

  initReset(userId) {
    return this.db.one(`
      INSERT INTO password_reset (user_id) 
      VALUES ($1) RETURNING *
    `, userId)
  }

  findById(id) {
    return this.db.oneOrNone(`
      SELECT * FROM password_reset WHERE id = $1
    `, id)
  }

  clearById(id) {
    return this.db.result(`
      DELETE FROM password_reset WHERE id = $1
    `, id, result => result.rowCount)
  }

  clearTable() {
    return this.db.none('TRUNCATE TABLE password_reset CASCADE')
  }
}

module.exports = PassResetModel