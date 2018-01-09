const router = require('express').Router()
const db = require('../../db')
const checkCsrf = require('../../middleware/check-csrf')
const checkAuth = require('../../middleware/check-auth')
const {
  NotFoundError,
  PermissionError
} = require('../../errors')

router.delete('/events/:id', [
  checkCsrf,
  checkAuth,
  async (req, res, next) => {
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

    if (event.owner !== req.user.id) {
      return next(new PermissionError)
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