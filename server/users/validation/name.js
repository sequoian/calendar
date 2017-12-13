const test = require('./validate')

const validateName = name => {
  if (!test.isString(name)) {
    return 'Must be a string'
  }
  name = name.trim()
  if (name.length < 1) {
    return 'Must be at least 1 character long'
  }
  return null
}

module.exports = validateName