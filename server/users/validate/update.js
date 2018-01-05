const {
  validateName,
  validatePassword
} = require('./fields/signup')
const {
  validateEmail,
  validateId
} = require('./fields/update')
const {exists} = require('../../util/validate')

// conditionally validate fields
const validateUpdate = async values => {
  const errors = {}

  let error

  // user id
  error = validateId(values.id)
  if (error) {
    errors.id = error
  }

  // email
  if (exists(values.email)) {
    error = await validateEmail(values.email, values.id)
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