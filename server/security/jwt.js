const jwt = require('jsonwebtoken')
const db = require('../db')

exports.createUserToken = user => {
  if (!user.id) {
    return null
  }
  
  const key = process.env.JWT_KEY
  const payload = {sub: user.id}
  return jwt.sign(payload, key)
}

const getIdFromToken = token => {
  const key = process.env.JWT_KEY
  try {
    const decoded = jwt.verify(token, key)
    return decoded.sub
  } catch (error) {
    return null
  }
}

exports.getIdFromToken = getIdFromToken

/**
 * Takes jwt token and returns the user that the token refers to
 * Async: returns a promise
 */
exports.getUserFromToken = async token => {
  const id = getIdFromToken(token)
  if (!id) {
    return null
  }

  try {
    // get user data
    const user = await db.users.findById(id)
    if (user) {
      return user
    }
    else {
      return null
    }
  }
  catch (error) {
    throw error
  }
}

exports.cookieOptions = {
  httpOnly: true,  // only readable on the server
  secure: true,  // only sent with https
  signed: true,  // additional security
  maxAge: 1000 * 60 * 60 * 24 * 365  // 1 year
}

