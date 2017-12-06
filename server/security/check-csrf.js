/**
 * Express middleware
 * Checks that csrf token match 
 */
const checkCsrf = (req, res, next) => {
  const userToken = req.get('X-CSRF-TOKEN')
  const csrf = req.cookies.csrf

  if (!csrf) {
    return res.status(401).json({
      errors: {
        req: 'CSRF cookie not found'
      }
    })
  }

  if (!userToken) {
    return res.status(401).json({
      errors: {
        req: 'A CSRF token must be included in request'
      }
    })
  }
  
  if (csrf !== userToken) {
    return res.status(403).json({
      errors: {
        req: 'Invalid CSRF token'
      }
    })
  }

  return next()
}

module.exports = checkCsrf