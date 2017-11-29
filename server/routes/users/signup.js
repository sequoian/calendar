const router = require('express').Router()
const db = require('../../db')

// const bcrypt = require('bcrypt')
// const saltRounds = 10

// const validateInputs = (req, res, next) => {
//   const {email, password} = req.body
//   validate.signup(email, password)
//     .then(() => next())
//     .catch(errors => {
//       res.status(400).json({
//         message: 'Validation failed',
//         errors
//       }).end()
//     })
// }

// const hashPassword = (req, res, next) => {
//   const {password} = req.body
//   const end = () => res.status(500).end()

//   bcrypt.genSalt(saltRounds, (error, salt) => {
//     if (error) end()

//     bcrypt.hash(password, salt, (error, hash) => {
//       if (error) end()

//       req.body.hashedPassword = hash
//       next()
//     })
//   })
// }

// const addUser = (req, res, next) => {
//   const {email, hashedPassword} = req.body

//   db.users.add(email.trim(), hashedPassword)
//     .then(user => {
//       res.status(204).end()
//     })
//     .catch(error => {
//       console.log(error)
//       res.status(500).end()
//     })
// }

// router.post('/signup', [
//   validateInputs,
//   hashPassword,
//   addUser
// ])

router.post('/users/signup', (req, res) => {
  res.status(200).end()
})

module.exports = router