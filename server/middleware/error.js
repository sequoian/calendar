const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case 'ValidationError':
      return res.status(400).json({
        errors: err.errors
      })
    case 'CsrfError':
    case 'AuthenticationError':
      return res.status(401).end()
    case 'PermissionError':
      return res.status(403).end()
    case 'NotFoundError':
      return res.status(404).end()
    default:
      console.log(err)
      return res.status(500).end()
  }
}

module.exports = errorHandler