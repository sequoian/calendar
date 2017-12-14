const router = require('express').Router()
const db = require('../../db')
const checkAuth = require('../../middleware/check-auth')
const {
  PermissionError,
  NotFoundError,
  ValidationError
} = require('../../errors')

router.get('/users', async (req, res) => {
  const email = req.query.email
  if (!email) {
    return res.status(400).end()
  }

  try {
    const result = await db.users.findByEmail(email)
    if (result) {
      return res.status(204).end()
    }
    else {
      return res.status(404).end()
    }
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
})

router.get('/users/:id', [
  checkAuth,
  async (req, res, next) => {
    const userId = parseInt(req.params.id)
    if (isNaN(userId)) {
      // invalid param
      return next(new ValidationError)
    }
  
    let user
    try {
      user = await db.users.findById(userId)
      if (!user) {
        return next(new NotFoundError)
      }
    } catch (e) {
      return next(error)
    }
  
    if (req.user.id !== user.id) {
      // cannot access data of other users
      return next(new PermissionError)
    }
  
    // all checks passed
    return res.status(200).json({
      data: {
        user
      }
    })
  }
])

module.exports = router