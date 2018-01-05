const router = require('express').Router()
const db = require('../../db')
const validate = require('../../middleware/validate')
const validateUser = validate(require('../validate').updateUser)
const validatePassword = validate(require('../validate').updatePassword)
const checkCsrf = require('../../middleware/check-csrf')
const checkAuth = require('../../middleware/check-auth')
const {
  PermissionError,
  NotFoundError,
  ValidationError
} = require('../../errors')

// Updates user information other than password.
// Accepts 1 or more properties to be updated
router.post('/users/:id', [
  checkCsrf,
  checkAuth,
  validateUser,
  async (req, res, next) => {
    let {id, email, name} = req.body
    const userId = req.params.id
  
    if (userId !== id) {
      return next(new ValidationError)
    }
  
    let user
    try {
      user = await db.users.findById(userId)
      if (!user) {
        return next(new NotFoundError)
      }
    } catch (error) {
      return next(error)
    }
  
    if (user.id !== req.user.id) {
      return next(new PermissionError)
    }
  
    // update user data
    // use new value, or if it doesn't exist use old value
    try {
      const updated = await db.users.update({
        ...user,
        email: email || user.email,
        name: name || user.name
      })
  
      const {password, ...noPass} = updated
      return res.status(200).json({
        data: {
          user: noPass
        }
      })
    } catch (error) {
      return next(error)
    }
  }
])

router.post('/users/:id/password', [
  checkCsrf,
  checkAuth,
  validatePassword,
  async (req, res, next) => {
    const password = req.body.password
    const userId = req.params.id
  
    let user
    try {
      user = await db.users.findById(userId)
      if (!user) {
        return next(new NotFoundError)
      }
    } catch (error) {
      return next(error)
    }
  
    if (user.id !== req.user.id) {
      return next(new PermissionError)
    }
  
    try {
      const result = await db.users.updatePassword(user.id, password)
      if (result !== 1) {
        throw new Error
      }
      return res.status(204).end()
    } catch (error) {
      return next(error)
    }
  }
])

module.exports = router