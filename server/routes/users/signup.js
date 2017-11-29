const router = require('express').Router()
const db = require('../../db')
const validate = require('../../validation').signup
const bcrypt = require('bcrypt')
const saltRounds = 10

const validateInputs = async (req, res, next) => {
  const errors = validate(req.body)

  if (!errors.email) {
    // test for duplicate email
    if (await db.users.findByEmail(req.body.email)) {
      errors.email = 'That email is already taken'
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
    if (error) end()

    bcrypt.hash(password, salt, (error, hash) => {
      if (error) end()

      req.body.hashedPassword = hash
      next()
    })
  })
}

const addUser = (req, res, next) => {
  const values = {
    email: req.body.email,
    password: req.body.hashedPassword,
    name: null
  }

  db.users.add(values)
    .then(user => {
      return res.status(200).json({
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        }
      })
    })
    .catch(error => {
      console.log(error)
      return res.status(500).end()
    })
}

router.post('/users/signup', [
  validateInputs,
  hashPassword,
  addUser
])

module.exports = router