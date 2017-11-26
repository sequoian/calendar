const db = require('./db')

db.users.findById(1)
  .then(r => console.log(r))
  .catch(e => console.log(e))