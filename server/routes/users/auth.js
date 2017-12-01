const router = require('express').Router()
const db = require('../../db')
const jwt = 

router.post('/users/auth', (req, res) => {
  const token = req.signedCookies.user

  
  
})

module.exports = router