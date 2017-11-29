exports.exists = value => typeof value !== 'undefined'

exports.isString = value => typeof value === 'string'

exports.validEmail = value => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)

exports.isEmpty = value => {
  if (typeof value === 'string') {
    // test string
    return !value
  }
  else if (Array.isArray(value)) {
    // test array
    return value.length < 1
  }
  else if (typeof value === 'object' && value !== null) {
    // test object
    return Object.keys(value).length < 1
  }
  else {
    return false
  }
}