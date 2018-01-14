const router = require('express').Router()
const db = require('../../db')
const checkCsrf = require('../../middleware/check-csrf')
const email = require('../../util/email')
const validate = require('../../middleware/validate')
const validatePassword = validate(require('../validate').updatePassword)
const {
  PermissionError,
  NotFoundError,
  ValidationError
} = require('../../errors')

router.get('/reset-password/check', async (req, res, next) => {
  const id = req.query.id
  if (!id) {
    return next(new ValidationError)
  }

  try {
    const result = await db.passreset.findById(id)
    if (result) {
      return res.status(204).end()
    }
    else {
      return next(new NotFoundError)
    }
  } catch (e) {
    return next(e)
  }
})

router.post('/reset-password/confirm', [
  checkCsrf,
  async (req, res, next) => {
    const {email} = req.body
    if (!email) {
      return next(new ValidationError)
    }

    try {
      const user = await db.users.findByEmail(email)
      if (!user) {
        return next(new NotFoundError)
      }

      // add reset to db
      const reset = await db.passreset.initReset(user.id)

      // send email
      const transporter = email.createTransporter()
      const options = email.mailOptions.passwordReset(user.email, reset.id)
      transporter.sendMail(options, (err, info) => {
        if (err) return next(e)
        // success
        return res.status(204).end()
      })
    } catch (e) {
      return next(e)
    }
  }
])

router.post('/reset-password/update', [
  checkCsrf,
  validatePassword,
  async (req, res, next) => {
    const id = req.query.id
    const {password} = req.body

    if (!id) {
      return next(new ValidationError)
    }

    try {
      const result = await db.passreset.findById(id)
      if (!result) {
        return next(new NotFoundError)
      }
      await db.users.updatePassword(result.user_id, password)
      return res.status(204).end()
    } catch (e) {
      return next(e)
    }

  }
])

module.exports = router