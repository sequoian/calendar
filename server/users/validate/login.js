const {isEmpty} = require('validator')

const validate = value => {
  try {
    if (isEmpty(value)) {
      return 'Required'
    }
  } catch (error) {
    return 'Invalid'
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