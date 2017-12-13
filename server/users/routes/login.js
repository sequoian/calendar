const router = require('express').Router()
const db = require('../../db')
const validate = require('../../validation').login
const bcrypt = require('bcrypt')
const jwt = require('../../security/jwt')
const checkCsrf = require('../../security/check-csrf')

const validateInputs = async (req, res, next) => {
  const errors = validate(req.body)

  if (!Object.keys(errors).length > 0) {
    // no errors
    return next()
  }
  else {
    return res.status(400).json({
      errors
    })
  }
}

const authenticateInputs = async (req, res, next) => {
  const {email, password} = req.body
  // send this response when email or password are invalid
  const invalidAndEnd = () => res.status(400).json({
    errors: {
      auth: 'The email and password do not match our records'
    }
  })
  
  let user
  try {
    // check user
    user = await db.users.findByEmail(email.trim())
    if (!user) {
      return invalidAndEnd()
    }
  } catch (e) {
    return next(e)
  }

  try {
    // check password
    const matches = await db.users.checkPassword(user.id, password)
    if (!matches) {
      return invalidAndEnd()
    }
  } catch (e) {
    return next(e)
  }

  req.body.user = user
  return next()
}

const sendToken = async (req, res, next) => {
  const {user} = req.body
  const token = jwt.createUserToken(user)

  res.cookie('user', token, jwt.cookieOptions)

  return res.status(200).json({
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  })
}

router.post('/users/login', [
  checkCsrf,
  validateInputs,
  authenticateInputs,
  sendToken
])

module.exports = router