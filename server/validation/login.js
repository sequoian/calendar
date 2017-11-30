const test = require('./validate')

const validate = value => {
  if (!test.exists(value)) {
    return 'Required'
  }
  if (!test.isString(value)) {
    return 'Must be a string'
  }
  if (test.isEmpty(value)) {
    return 'Required'
  }
  return null
}

const validateLogin = values => {
  const errors = {}

  let error = validate(values.email)
  if (error) {
    errors.email = error
  }

  error = validate(values.password)
  if (error) {
    errors.password = error
  }

  return errors
}

module.exports = validateLogin