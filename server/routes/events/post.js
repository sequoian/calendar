const router = require('express').Router()
const db = require('../../db')
const checkCsrf = require('../../security/check-csrf')
const checkAuth = require('../../security/user-auth')

router.post('/events', [
  checkCsrf,
  checkAuth,
  async (req, res, next) => {
    return res.status(200).end()
  }
])

module.exports = router