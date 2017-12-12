class CsrfError extends Error {
  constructor(...params) {
    super(...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }
    this.name = 'CsrfError'
  }
}

class AuthenticationError extends Error {
  constructor(...params) {
    super(...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }
    this.name = 'AuthenticationError'
  }
}

class PermissionError extends Error {
  constructor(...params) {
    super(...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }
    this.name = 'PermissionError'
  }
}

class NotFoundError extends Error {
  constructor(...params) {
    super(...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }
    this.name = 'NotFoundError'
  }
}

class ValidationError extends Error {
  constructor(errors = {}, ...params) {
    super(...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }
    this.errors = errors
    this.name = 'ValidationError'
  }
}

module.exports = {
  CsrfError,
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ValidationError
}