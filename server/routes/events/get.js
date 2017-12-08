const router = require('express').Router()
const db = require('../../db')
const checkAuth = require('../../security/user-auth')

router.get('/events', [
  checkAuth,
  async (req, res, next) => {
    const user = req.user

    try {
      const events = await db.events.findAllByUser(user.id)
      return res.status(200).json({
        data: {
          events
        }
      })
    } catch (e) {
      return next(e)
    }
  }
])

router.get('/events/:id', [
  checkAuth,
  async (req, res, next) => {
    const user = req.user
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

    if (event.owner !== user.id) {
      return res.status(403).end()
    }

    return res.status(200).json({
      data: {
        event
      }
    })
  }
])

module.exports = router