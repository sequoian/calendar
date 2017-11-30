const router = require('express').Router()
const db = require('../../db')

router.post('/users/auth', (req, res) => {
  const token = req.signedCookies.user

  
})

module.exports = router