const {
  validateEmail,
  validatePassword,
  validateName
} = require('./fields/signup')

const validateSignup = async values => {
  const errors = {}

  let error
  
  // email
  try {
    error = await validateEmail(values.email)
    values.email = values.email.trim()
  } catch (e) {
    error = 'Invalid'
  }
  if (error) {
    errors.email = error
  }

  // password
  try {
    error = validatePassword(values.password)
  } catch (e) {
    error = 'Invalid'
  }
  if (error) {
    errors.password = error
  }

  // name
  try {
    error = validateName(values.name)
    values.name = values.name.trim()
  } catch (e) {
    error = 'Invalid'
  }
  if (error) {
    errors.name = error
  }

  return errors
}

module.exports = validateSignup