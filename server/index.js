require('dotenv').config()

const db = require('./db')

db.events.findById(1)
  .then(result => {
    console.log(result)
  })
  .catch(error => {
    console.log(error)
  })