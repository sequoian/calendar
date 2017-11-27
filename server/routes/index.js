const router = require('express').Router()

router.use('/api', [
  require('./users'),
  require('./events')
])

module.exports = router