const router = require('express').Router()
const db = require('../../db')
const validate = require('../../validation').signup
const jwt = require('../../security/jwt')
const bcrypt = require('bcrypt')
const saltRounds = 10

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

const hashPassword = (req, res, next) => {
  const {password} = req.body
  const end = () => res.status(500).end()

  bcrypt.genSalt(saltRounds, (error, salt) => {
    if (error) {
      return end()
    }

    bcrypt.hash(password, salt, (error, hash) => {
      if (error) {
        return end()
      }

      req.body.hashedPassword = hash
      next()
    })
  })
}

const addUser = async (req, res, next) => {
  const values = {
    email: req.body.email.trim(),
    password: req.body.hashedPassword,
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
  validateInputs,
  hashPassword,
  addUser
])

module.exports = router