const router = require('express').Router()
const db = require('../../db')

// placeholder auth check
const authenticateUser = async (req, res, next) => {
  const userId = req.body
  let user
  try {
    user = await db.users.findById(userId)
  } catch (error) {
    console.log(error)
    res.status(500).end()
  }
  
  if (!user) {
    res.status(401).end()
  }
  next()
}

const getUserEvents = async (req, res, next) => {
  const {userId} = req.body
  try {
    const events = await db.events.findAllByUser(userId)
    res.status(200).json({
      data: {
        events
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).end()
  }
}

const getEvent = async (req, res, next) => {
  const {userId} = req.body
  const deckId = parseInt(req.params.id)

  let event
  try {
    event = await db.events.findById(deckId)
  } catch (error) {
    console.log(error)
    res.status(500).end()
  }

  if (event.owner === userId) {
    res.status(200).json({
      data: {
        event
      }
    })
  }
  else {
    res.status(403).end()
  }
}

router.get('/events', [
  authenticateUser,
  getUserEvents
])

router.get('/events/:id', [
  authenticateUser,
  getEvent
])

router.get('/test', (req, res) => {
  res.status(204).end()
})

module.exports = router