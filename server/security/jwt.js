const jwt = require('jsonwebtoken');

exports.createUserToken = user => {
  const key = process.env.JWT_KEY
  const payload = {sub: user.id}
  return jwt.sign(payload, key)
}

exports.getUserFromToken = token => {
  const key = process.env.JWT_KEY
  try {
    const decoded = jwt.verify(token, key)
    return decoded.sub
  } catch (error) {
    return null
  }
}

exports.cookieOptions = {
  httpOnly: true,  // only readable on the server
  secure: true,  // only sent with https
  signed: true,  // additional security
  maxAge: 1000 * 60 * 60 * 24 * 365  // 1 year
}

