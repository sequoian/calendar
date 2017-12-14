const router = require('express').Router()
const db = require('../../db')
const jwt = require('../../util/jwt')
const csrf = require('../../util/csrf')

router.post('/users/auth', async (req, res) => {
  const userToken = req.signedCookies.user
  const user = await jwt.getUserFromToken(userToken)
  const csrfToken = await csrf.generateToken()
  res.cookie('csrf', csrfToken, csrf.cookieOptions)

  if (!user) {
    return res.status(401).end()
  }
  else {
    return res.status(200).json({
      data: {
        user
      }
    })
  }
})

module.exports = router