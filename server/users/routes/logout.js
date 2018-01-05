const router = require('express').Router()
const db = require('../../db')
const checkCsrf = require('../../middleware/check-csrf')
const checkAuth = require('../../middleware/check-auth')
const {
  NotFoundError,
  PermissionError
} = require('../../errors')

router.post('/users/:id/logout', [
  checkCsrf,
  checkAuth,
  async (req, res, next) => {
    const userId = req.params.id
    
    let user
    try {
      user = await db.users.findById(userId)
      if (!user) {
        return next(new NotFoundError)
      }
    } catch (e) {
      return next(e)
    }
  
    if (user.id !== req.user.id) {
      return next(new PermissionError)
    }
  
    res.clearCookie('user')
    return res.status(204).end()
  }
])

module.exports = router