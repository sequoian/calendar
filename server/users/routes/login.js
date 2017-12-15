const router = require('express').Router()
const db = require('../../db')
const validate = require('../../middleware/validate')
const validateBody = validate(require('../validate').login)
const jwt = require('../../util/jwt')
const checkCsrf = require('../../middleware/check-csrf')
const {ValidationError} = require('../../errors')

router.post('/users/login', [
  checkCsrf,
  validateBody,
  async (req, res, next) => {
    let user

    try {
      const {email, password} = req.body
      const errors = {auth: 'The email and password do not match our records'}

      // check user
      user = await db.users.findByEmail(email)
      if (!user) {
        throw new ValidationError(errors)
      }

      // check password
      const matches = await db.users.checkPassword(user.id, password)
      if (!matches) {
        throw new ValidationError(errors)
      }
    } catch (e) {
      return next(e)
    }
  
    // create and send new user token as cookie
    const token = jwt.createUserToken(user)
    res.cookie('user', token, jwt.cookieOptions)

    return res.status(200).json({
      data: {
        user
      }
    })
  }
])

module.exports = router