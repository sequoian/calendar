const crypto = require('crypto')

exports.generateToken = (callback) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(48, (err, buff) => {
      if (err) {
        reject(err)
      }
      resolve(buff.toString('hex'))
    })
  })
}

exports.cookieOptions = {
  secure: true,  // only sent with https
}