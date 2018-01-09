const router = require('express').Router()
const db = require('../../db')
const checkCsrf = require('../../middleware/check-csrf')
const checkAuth = require('../../middleware/check-auth')
const validate = require('../../middleware/validate')
const validateBody = validate(require('../validation'))
const {
  NotFoundError,
  PermissionError
} = require('../../errors')

router.post('/events', [
  checkCsrf,
  checkAuth,
  validateBody,
  async (req, res, next) => {
    const event = req.body
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
      return next(e)
    }
  }
])

router.post('/events/:id', [
  checkCsrf,
  checkAuth,
  validateBody,
  async (req, res, next) => {
    const body = req.body

    // check if exists
    const eventId = req.params.id
    let event
    try {
      event = await db.events.findById(eventId)
      if (!event) {
        return next(new NotFoundError)
      }
    } catch (e) {
      return next(e)
    }

    // check permission
    if (event.owner !== req.user.id) {
      return next(new PermissionError)
    }

    // update
    body.id = event.id
    body.owner = event.owner
    try {
      const updated = await db.events.update(body)
      return res.status(200).json({
        data: {
          event: updated
        }
      })
    } catch (e) {
      return next(e)
    }
  }
])

module.exports = router