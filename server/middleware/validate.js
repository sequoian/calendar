const {ValidationError} = require('../errors')

/**
 * Validation middleware
 */
const validate = callback => async (req, res, next) => {
  
  if (typeof callback !== 'function') {
    return next(new Error('Validation callback required.'))
  }

  const errors = await callback(req.body)

  if (errors === null || typeof errors !== 'object') {
    return next(new Error('Callback must return errors object'))
  }

  if (Object.keys(errors).length > 0) {
    return next(new ValidationError(errors))
  }
  else {
    return next()
  }
}

module.exports = validate