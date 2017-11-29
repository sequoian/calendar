const router = require('express').Router()
const db = require('../../db')

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
  require('./signup')
])

module.exports = router