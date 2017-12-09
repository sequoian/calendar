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
      return next(e)
    }
  }
])

router.post('/events/:id', [
  checkCsrf,
  checkAuth,
  async (req, res, next) => {
    const body = req.body
    // validate
    const errors = validate(body)
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors
      })
    }

    // check if exists
    const eventId = req.params.id
    let event
    try {
      event = await db.events.findById(eventId)
      if (!event) {
        return res.status(404).end()
      }
    } catch (e) {
      return next(e)
    }

    // check permission
    if (event.owner !== req.user.id) {
      return res.status(403).end()
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