const jwt = require('./jwt')
const db = require('../db')

/**
 * Express middleware that checks if the user is authenticated.
 * When authenticated, sets adds user id to req for other middleware to use.
 * When not authenticated, responds with 401 and ends the chain.
 */
const enforceAuthentication = async (req, res, next) => {
  const end = () => res.status(401).end()

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
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }

  // authentication passed
  req.user = user
  return next()
} 

module.exports = enforceAuthentication