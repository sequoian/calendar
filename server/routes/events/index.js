const router = require('express').Router()

router.use('/', [
  require('./get'),
  require('./post')
])

module.exports = router