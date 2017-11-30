const jwt = require('jsonwebtoken');

exports.createToken = user => {
  const key = process.env.JWT_KEY
  const payload = {sub: user.id}

  return jwt.sign(payload, key)
}

exports.cookieOptions = {
  httpOnly: true,  // only readable on the server
  secure: true,  // only sent with https
  signed: true,  // additional security
  maxAge: 1000 * 60 * 60 * 24 * 365  // 1 year
}