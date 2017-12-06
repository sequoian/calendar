const router = require('express').Router()
const db = require('../../db')
const validate = require('../../validation').signup
const checkCsrf = require('../../security/check-csrf')
const checkAuth = require('../../security/user-auth')
const hashPass = require('../../security/hash')

const validateUpdate = (req, res, next) => {

}

const updateUser = (req, res, next) => {

}

const validatePassword = (req, res, next) => {
  const password = req.body.password
  const errors = validate({password})

  if (errors.password) {
    return res.status(400).json({
      errors: {
        password: errors.password
      }
    })
  }

  return next()
}

const updateUserPassword = async (req, res, next) => {
  const password = req.body.password
  const userId = req.params.id

  let user
  try {
    user = await db.users.findById(userId)
    if (!user) {
      return res.status(404).end()
    }
  } catch (error) {
    return next(error)
  }

  if (user.id !== req.user.id) {
    return res.status(403).end()
  }

  let hashedPassword
  try {
    hashedPassword = await hashPass(password)
  } catch (error) {
    next(error)
  }

  try {
    const updatedUser = await db.users.update({
      ...user,
      password: hashedPassword
    })
    return res.status(204).end()
  } catch (error) {
    return next(error)
  }
}


router.post('/users/:id', [
  checkCsrf,
  checkAuth,
])

router.post('/users/:id/password', [
  checkCsrf,
  checkAuth,
  validatePassword,
  updateUserPassword
])

module.exports = router