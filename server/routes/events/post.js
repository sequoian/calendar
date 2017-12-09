const router = require('express').Router()
const db = require('../../db')
const checkCsrf = require('../../security/check-csrf')
const checkAuth = require('../../security/user-auth')
const validate = require('../../validation').events

router.post('/events', [
  checkCsrf,
  checkAuth,
  async (req, res, next) => {
    const event = req.body
    // validate
    const errors = validate(event)
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors
      })
    }

    // add to db
    event.owner = req.user.id
    try {
      const newEvent = await db.events.add(event)
      return res.status(200).json({
        data: {
          event: newEvent
        }
      })
    } catch (e) {
      next(e)
    }
  }
])

module.exports = router