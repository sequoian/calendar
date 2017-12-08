const router = require('express').Router()
const db = require('../../db')
const checkAuth = require('../../security/user-auth')

const fetchUserData = async (req, res, next) => {
  const userId = parseInt(req.params.id)
  if (!userId) {
    // invalid param
    return res.status(400).end()
  }

  let user
  try {
    user = await db.users.findById(userId)
    if (!user) {
      // user does not exist
      return res.status(404).end()
    }
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }

  const client = req.user
  if (client.id !== user.id) {
    // cannot access data of other users
    return res.status(403).end()
  }

  // all checks passed
  return res.status(200).json({
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
  })
}

router.get('/users/:id', [
  checkAuth,
  fetchUserData
])

router.get('/users', async (req, res) => {
  const email = req.query.email
  if (!email) {
    return res.status(400).end()
  }

  try {
    const result = await db.users.findByEmail(email)
    if (result) {
      return res.status(204).end()
    }
    else {
      return res.status(404).end()
    }
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
})

// combine the other user routes
router.use('/', [
  require('./signup'),
  require('./login'),
  require('./auth'),
  require('./update'),
  require('./logout'),
  require('./delete')
])

module.exports = router