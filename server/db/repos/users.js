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

  update(data) {
    return this.db.oneOrNone(`
      UPDATE users SET 
        email = $[email],
        password = $[password],
        name = $[name]
      WHERE id = $[id] RETURNING *
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

  findByEmail(email) {
    return this.db.oneOrNone(`
      SELECT * FROM users WHERE email = $1
    `, email)
  }

  clearTable() {
    return this.db.none('TRUNCATE TABLE users CASCADE')
  }
}

module.exports = UserRepository