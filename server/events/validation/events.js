const test = require('./validate')

const validateTitle = title => {
  if (!test.exists(title)) {
    return 'Required'
  }
  if (!test.isString(title)) {
    return 'Must be a string'
  }
  title = title.trim()
  if (test.isEmpty(title)) {
    return 'Requried'
  }
  return null
}

const validateDay = day => {
  if (day === null) {
    return null
  }
  if (!test.exists(day)) {
    return 'Required'
  }
  if (!test.isString(day)) {
    return 'Must be a string'
  }
  if (!test.isDate(new Date(day))) {
    return 'The string must be a valid date'
  }
  return null
}

const validateTime = time => {
  if (time === null) {
    return null
  }
  if (!test.exists(time)) {
    return 'Required'
  }
  if (!test.isString(time)) {
    return 'Must be a string'
  }
  return null
}

const validateLocation = location => {
  if (location === null) {
    return null
  }
  if (!test.exists(location)) {
    return 'Required'
  }
  if (!test.isString(location)) {
    return 'Must be a string'
  }
  return null
}

const validateDescription = description => {
  if (description === null) {
    return null
  }
  if (!test.exists(description)) {
    return 'Required'
  }
  if (!test.isString(description)) {
    return 'Must be a string'
  }
  return null
}


const validateEvents = values => {
  const errors = {}

  let error = validateTitle(values.title)
  if (error) {
    errors.title = error
  }

  error = validateDay(values.day)
  if (error) {
    errors.day = error
  }

  error = validateTime(values.time)
  if (error) {
    errors.time = error
  }

  error = validateLocation(values.location)
  if (error) {
    errors.location = error
  }

  error = validateDescription(values.description)
  if (error) {
    errors.description = error
  }

  return errors
}

module.exports = validateEvents