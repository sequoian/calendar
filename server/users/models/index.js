const bcrypt = require('bcrypt')

class UserModel {
  constructor(db) {
    this.db = db
  }

  async add(data) {
    const hashed = await hashPassword(data.password)
    const user = Object.assign({}, data, {password: hashed})
    return this.db.one(`
      INSERT INTO users (email, password, name)
      VALUES ($[email], $[password], $[name])
      RETURNING id, email, name
    `, user)
  }

  update(data) {
    return this.db.oneOrNone(`
      UPDATE users SET 
        email = $[email],
        name = $[name]
      WHERE id = $[id] RETURNING id, email, name
    `, data)
  }

  async updatePassword(id, password) {
    const hashed = await hashPassword(password)
    return this.db.result(`
      UPDATE users SET
        password = $2
      WHERE id = $1
    `, [id, hashed], result => result.rowCount)
  }

  remove(id) {
    return this.db.result(`
      DELETE FROM users WHERE id = $1
    `, id, result => result.rowCount)
  }

  findById(id) {
    return this.db.oneOrNone(`
      SELECT id, email, name FROM users WHERE id = $1
    `, id)
  }

  findByEmail(email) {
    return this.db.oneOrNone(`
      SELECT id, email, name FROM users WHERE email = $1
    `, email)
  }

  checkPassword(id, password) {
    return this.db.oneOrNone(`
      SELECT password FROM users WHERE id = $1
    `, id)
      .then(user => {
        return comparePassword(password, user.password)
      })
  }

  clearTable() {
    return this.db.none('TRUNCATE TABLE users CASCADE')
  }
}

module.exports = UserModel


// Helpers

const comparePassword = (plain, hashed) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plain, hashed, (error, success) => {
      if (error) {
        resolve(false)
      }
      resolve(success)
    })
  })
}

const hashPassword = password => {
  const saltRounds = 10
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (error, salt) => {
      if (error) {
        reject(error)
      }
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) {
          reject(error)
        }
        resolve(hash)
      })
    })
  })
}