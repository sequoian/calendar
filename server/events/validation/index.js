const {
  isEmpty,
  isISO8601
} = require('validator')

const validateTitle = title => {
  try {
    title = title.trim()
    if (isEmpty(title))
      return 'Required'
  } catch (e) {
    return 'Invalid'
  }
  return null
}

const validateDay = day => {
  try {
    if (isEmpty(day)) 
      return null
    if (!isISO8601(day))
      return 'String must be a valid iso 8601 day'
  } catch (e) {
    return 'Invalid'
  }
  return null
}

const optionalString = value => {
  try {
    if (isEmpty(value))
      return null
  } catch (e) {
    return 'Invalid'
  }
  return null
}


const validateEvents = values => {
  const errors = {}

  // title
  let error = validateTitle(values.title)
  if (error) {
    errors.title = error
  }

  // day
  error = validateDay(values.day)
  if (error) {
    errors.day = error
  }

  // time
  error = optionalString(values.time)
  if (error) {
    errors.time = error
  }

  // location
  error = optionalString(values.location)
  if (error) {
    errors.location = error
  }

  // description
  error = optionalString(values.description)
  if (error) {
    errors.description = error
  }

  return errors
}

module.exports = validateEvents