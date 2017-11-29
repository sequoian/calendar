const test = require('./validate')

const validateEmail = email => {
  if (!test.exists(email)) {
    return 'Required'
  }
  if (!test.isString(email)) {
    return 'Must be a string'
  }
  if (test.isEmpty(email)) {
    return 'Requried'
  }
  email = email.trim()
  if (!test.validEmail(email)) {
    return 'Please use a valid email'
  }
  return null
}

const validatePassword = password => {
  if (!test.exists(password)) {
    return 'Required'
  }
  if (!test.isString(password)) {
    return 'Must be a string'
  }
  if (test.isEmpty(password)) {
    return 'Required'
  }
  if (password.length < 6) {
    return 'Must be at least 6 characters long'
  }
  return null
}

const validateSignup = values => {
  const errors = {}

  let error = validateEmail(values.email)
  if (error) {
    errors.email = error
  }

  error = validatePassword(values.password)
  if (error) {
    errors.password = error
  }

  return errors
}

module.exports = validateSignup