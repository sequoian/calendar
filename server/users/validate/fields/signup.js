const db = require('../../../db')
const {
  isEmpty,
  isEmail,
  trim
} = require('validator')

exports.validateEmail = async email => {
  try {
    if (isEmpty(email)) {
      return 'Required'
    }
    
    email = email.trim()
  
    if (!isEmail(email)) {
      return 'Please use a valid email'
    }
  
    // check that email is available
    const emailTaken = await db.users.findByEmail(email)
  
    if (emailTaken) {
      return 'That email is already taken'
    }
  } catch (error) {
    return 'Invalid'
  }

  // passed validation
  return null
}

exports.validatePassword = password => {
  try {
    if (isEmpty(password)) {
      return 'Required'
    }
  
    if (password.length < 6) {
      return 'Must be at least 6 characters long'
    }
  } catch (error) {
    return 'Invalid'
  }

  // passed validation
  return null
}

exports.validateName = name => {
  try {
    if (isEmpty(name)) {
      // valid if '' is passed to name
      return null
    }
  
    name = name.trim()
  
    // check only if whitespace was passed to name, indicating user may want name
    if (isEmpty(name)) {
      return 'Name must be at least 1 character long'
    }
  } catch (error) {
    return 'Invalid'
  }

  return null
}