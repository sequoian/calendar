const router = require('express').Router()
const db = require('../../db')
const validate = require('../../validation').signup
const validateName = require('../../validation').name
const checkCsrf = require('../../security/check-csrf')
const checkAuth = require('../../security/user-auth')
const {
  ValidationError,
  PermissionError,
  NotFoundError
} = require('../../errors')

const validateUpdate = async (req, res, next) => {
  const {email, name} = req.body
  const userId = req.params.id
  const errors = {}

  if (!email && !name) {
    // return error if nothing is in the body to update
    return res.status(400).end()
  }

  if (email) {
    // validates with signup validation
    const result = validate({email})
    const error = result.email

    // check for validation error
    if (!error) {
      // check for db conflict
      try {
        const emailExists = await db.users.findByEmail(email.trim())
        if (emailExists && emailExists.id !== userId) {
          // email exists and it is not user's email
          error = 'That email already exists'
        }
      } catch (error) {
        return next (error)
      }
    }

    // check again in case of db conflict
    if (error) {
      errors.email = error
    }
  }

  if (name) {
    // validates with specific name check function
    const error = validateName(name)
    if (error) {
      errors.name = error
    }
  }

  if (Object.keys(errors).length > 0) {
    return next(new ValidationError(errors))
  }

  return next()
}

const updateUser = async (req, res, next) => {
  let {email, name} = req.body
  const userId = req.params.id

  let user
  try {
    user = await db.users.findById(userId)
  } catch (error) {
    return next(error)
  }

  if (!user) {
    return next(new NotFoundError)
  }

  if (user.id !== req.user.id) {
    return next(new PermissionError)
  }
  
  // trim inputs if they exist
  if (email) email = email.trim()
  if (name) name = name.trim()

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

  try {
    const result = await db.users.updatePassword(user.id, password)
    if (result !== 1) {
      return res.status(500).end()
    }
    return res.status(204).end()
  } catch (error) {
    return next(error)
  }
}

// Updates user information other than password.
// Accepts 1 or more properties to be updated
router.post('/users/:id', [
  checkCsrf,
  checkAuth,
  validateUpdate,
  updateUser
])

router.post('/users/:id/password', [
  checkCsrf,
  checkAuth,
  validatePassword,
  updateUserPassword
])

module.exports = router