const jwt = require('../util/jwt')
const db = require('../db')
const {AuthenticationError} = require('../errors')

/**
 * Express middleware that checks if the user is authenticated.
 * When authenticated, sets adds user id to req for other middleware to use.
 * When not authenticated, responds with 401 and ends the chain.
 */
const enforceAuthentication = async (req, res, next) => {
  const end = () => next(new AuthenticationError)

  // check that token exists
  const token = req.signedCookies.user
  if (!token) {
    return end()
  }

  // check that user exists
  let user
  try {
    user = await jwt.getUserFromToken(token)
    if (!user) {
      return end()
    }
  } catch (e) {
    return next(e)
  }

  // authentication passed
  req.user = user
  return next()
} 

module.exports = enforceAuthentication