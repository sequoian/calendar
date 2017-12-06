const crypto = require('crypto')

exports.generateToken = (callback) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(48, (err, buff) => {
      if (err) {
        return reject(err)
      }
      return resolve(buff.toString('hex'))
    })
  })
}

exports.cookieOptions = {
  secure: true,  // only sent with https
}