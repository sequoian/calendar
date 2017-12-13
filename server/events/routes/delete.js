const router = require('express').Router()
const db = require('../../db')
const checkCsrf = require('../../security/check-csrf')
const checkAuth = require('../../security/user-auth')

router.delete('/events/:id', [
  checkCsrf,
  checkAuth,
  async (req, res, next) => {
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

    if (event.owner !== req.user.id) {
      return res.status(403).end()
    }

    try {
      const deleted = await db.events.remove(event.id)
      return res.status(204).end()
    } catch (e) {
      return next(e)
    }
  }
])

module.exports = router