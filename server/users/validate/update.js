const {
  validateEmail,
  validateName,
  validatePassword
} = require('./fields/signup')
const {exists} = require('../../util/validate')

// conditionally validate fields
const validateUpdate = async values => {
  const errors = {}

  let error
  
  // email
  if (exists(values.email)) {
    error = await validateEmail(values.email)
    if (error) {
      errors.email = error
    }
  }

  // name
  if (exists(values.name)) {
    error = validateName(values.name)
    if (error) {
      errors.name = error
    }
  }

  return errors
}

const validatePasswordUpdate = values => {
  const errors = {}

  const error = validatePassword(values.password)
  if (error) {
    errors.password = error
  }

  return errors
}

module.exports = {
  validateUpdate,
  validatePasswordUpdate
}