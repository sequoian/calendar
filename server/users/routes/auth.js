const router = require('express').Router()
const db = require('../../db')
const jwt = require('../../util/jwt')
const csrf = require('../../util/csrf')
const {AuthenticationError} = require('../../errors')

router.post('/users/auth', async (req, res, next) => {
  const userToken = req.signedCookies.user
  const user = await jwt.getUserFromToken(userToken)
  const csrfToken = await csrf.generateToken()
  res.cookie('csrf', csrfToken, csrf.cookieOptions)

  if (!user) {
    return next(new AuthenticationError)
  }
  
  return res.status(200).json({
    data: {
      user
    }
  })
})

module.exports = router