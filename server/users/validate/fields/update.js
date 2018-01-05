const db = require('../../../db')
const {
  isEmpty,
  isEmail,
  isInt
} = require('validator')

exports.validateId = id => {
  try {
    if (!isInt(id)) {
      return 'Must be an int'
    }
  } catch (error) {
    return 'Invalid'
  }

  return null
}

exports.validateEmail = async (email, userId) => {
  try {
    if (isEmpty(email)) {
      return 'Required'
    }
    
    email = email.trim()
  
    if (!isEmail(email)) {
      return 'Please use a valid email'
    }
  
    // check that email is available
    const user = await db.users.findByEmail(email)
    if (user && user.id !== parseInt(userId)) {
      return 'That email is already taken'
    }
  } catch (error) {
    return 'Invalid'
  }

  // passed validation
  return null
}