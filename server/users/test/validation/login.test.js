const should = require('chai').should()
const validate = require('../index').login

describe ('login form validation', () => {
  const valid = {
    email: 'test@test.com',
    password: '123456'
  }

  it ('invalid email', () => {
      const values = Object.assign({}, valid)
      values.email = null
      validate(values).should.have.property('email')
      values.email = ''
      validate(values).should.have.property('email')
  })

  it ('invalid password', () => {
    const values = Object.assign({}, valid)
    values.password = null
    validate(values).should.have.property('password')
    values.password = ''
    validate(values).should.have.property('password')
  })

  it ('valid form', () => {
    validate(valid).should.be.empty
  })
}) 