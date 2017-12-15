const router = require('express').Router()

// combine the other user routes
router.use('/', [
  require('./get'),
  require('./signup'),
  require('./login'),
  require('./auth'),
  // require('./update'),
  // require('./logout'),
  // require('./delete')
])

module.exports = router