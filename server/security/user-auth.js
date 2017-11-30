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

  // check that token is valid
  const id = jwt.getUserFromToken(user)
  if (!id) {
    return end()
  }

  // check that user exists
  try {
    const user = await db.users.findById(id)
    if (!user) {
      return end()
    }
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }

  req.userId = user
  return next()
} 