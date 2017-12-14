const router = require('express').Router()
const db = require('../../db')
const validate = require('../validate/index').signup
const jwt = require('../../util/jwt')
const checkCsrf = require('../../middleware/check-csrf')

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
  req.body.name = null
  // add user to db
  let user
  try {
    user = await db.users.add(req.body)
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