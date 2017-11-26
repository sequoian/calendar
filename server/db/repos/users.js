class UserRepository {
  constructor(db) {
    this.db = db
  }

  add(data) {
    return this.db.one(`
      INSERT INTO users (email, password, name)
      VALUES ($[email], $[password], $[name])
      RETURNING *
    `, data)
  }

  remove(id) {
    return this.db.result(`
      DELETE FROM users WHERE id = $1
    `, id, result => result.rowCount)
  }

  findById(id) {
    return this.db.oneOrNone(`
      SELECT * FROM users WHERE id = $1
    `, id)
  }
}

module.exports = UserRepository