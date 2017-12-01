const router = require('express').Router()
const db = require('../../db')
const jwt = require('../../security/jwt')

router.post('/users/auth', async (req, res) => {
  const token = req.signedCookies.user
  const user = await jwt.getUserFromToken(token)

  if (!user) {
    return res.status(401).end()
  }
  else {
    return res.status(200).json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    })
  }
})

module.exports = router