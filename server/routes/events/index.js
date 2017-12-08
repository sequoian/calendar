const router = require('express').Router()
const db = require('../../db')
const checkAuth = require('../../security/user-auth')

router.get('/events', [
  checkAuth,
  async (req, res, next) => {
    const user = req.user

    let events
    try {
      events = await db.events.findAllByUser(user.id)
    } catch (e) {
      return next(e)
    }
    
    return res.status(200).json({
      data: {
        events
      }
    })
  }
])

module.exports = router