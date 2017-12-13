const {CsrfError} = require('../errors')
/**
 * Express middleware
 * Checks that csrf token match 
 */
const checkCsrf = (req, res, next) => {
  const userToken = req.get('X-CSRF-TOKEN')
  const csrf = req.cookies.csrf

  if (!csrf || !userToken) {
    return next(new CsrfError)
  }
  
  if (csrf !== userToken) {
    return next(new CsrfError)
  }

  return next()
}

module.exports = checkCsrf