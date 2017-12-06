const bcrypt = require('bcrypt')
const saltRounds = 10

const hashPassword = (password) => {
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

module.exports = hashPassword