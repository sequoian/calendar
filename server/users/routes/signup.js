const router = require('express').Router()
const db = require('../../db')
const jwt = require('../../util/jwt')
const checkCsrf = require('../../middleware/check-csrf')
const validate = require('../../middleware/validate')
const validateBody = validate(require('../validate/index').signup)

router.post('/users/signup', [
  checkCsrf,
  validateBody,
  async (req, res, next) => {
    let user
    try {
      user = await db.users.add(req.body)
    } catch (e) {
      return next(e)
    }
    
    // log user in
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