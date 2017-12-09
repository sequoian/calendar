const router = require('express').Router()

router.use('/', [
  require('./get'),
  require('./post'),
  require('./delete')
])

module.exports = router