const router = require('express').Router()
const db = require('../../db')
const checkCsrf = require('../../security/check-csrf')
const authUser = require('../../security/user-auth')

const logoutUser = async (req, res, next) => {
  const userId = req.params.id

  let user
  try {
    user = await db.users.findById(userId)
    if (!user) {
      return res.status(404).end()
    }
  } catch (e) {
    return next(e)
  }

  if (user.id !== req.user.id) {
    return res.status(403).end()
  }

  res.clearCookie('user')
  return res.status(204).end()
}

router.post('/users/:id/logout', [
  checkCsrf,
  authUser,
  logoutUser
])

module.exports = router