const {
  validateEmail,
  validatePassword,
  validateName
} = require('./fields/signup')

const validateSignup = async values => {
  const errors = {}

  let error
  
  // email
  error = await validateEmail(values.email)
  if (error) {
    errors.email = error
  }

  // password
  error = validatePassword(values.password)
  if (error) {
    errors.password = error
  }

  // name
  error = validateName(values.name)
  if (error) {
    errors.name = error
  }

  return errors
}

module.exports = validateSignup