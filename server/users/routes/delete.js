const router = require('express').Router()
const db = require('../../db')
const checkCsrf = require('../../middleware/check-csrf')
const authUser = require('../../middleware/check-auth')
const {
  NotFoundError,
  PermissionError
} = require('../../errors')

router.delete('/users/:id', [
  checkCsrf,
  authUser,
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
  
    try {
      const deleted = await db.users.remove(user.id)
      if (deleted !== 1) {
        throw new Error
      } 
  
      // delete cookie and return
      res.clearCookie('user')
      return res.status(204).end()
    } catch (e) {
      return next (e)
    }
  }
])

module.exports = router