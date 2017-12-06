const router = require('express').Router()
const db = require('../../db')
const validate = require('../../validation').signup
const jwt = require('../../security/jwt')
const checkCsrf = require('../../security/check-csrf')
const hashPass = require('../../security/hash')

const validateInputs = async (req, res, next) => {
  const errors = validate(req.body)

  if (!errors.email) {
    // test for duplicate email
    try {
      const emailExists = await db.users.findByEmail(req.body.email.trim())
      if (emailExists) {
        errors.email = 'That email is already taken'
      }
    } catch (error) {
      console.log(error)
      return res.status(500).end()
    }
  }

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

const addUser = async (req, res, next) => {
  let hashedPassword
  try {
    hashedPassword = await hashPass(req.body.password)
  } catch (error) {
    next(error)
  }

  const values = {
    email: req.body.email.trim(),
    password: hashedPassword,
    name: null
  }

  // add user to db
  let user
  try {
    user = await db.users.add(values)
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
  
  // log user in
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

router.post('/users/signup', [
  checkCsrf,
  validateInputs,
  addUser
])

module.exports = router