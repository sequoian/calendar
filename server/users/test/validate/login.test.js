const validate = require('../../validate/login')
const expect = require('chai').expect

describe.only('login form validation', () => {
  const valid = {
    email: 'test@test.com',
    password: '123456'
  }

  it('invalid email', () => {
      expect(validate({...valid, email: null})).to.have.property('email')
      expect(validate({...valid, email: ''})).to.have.property('email')
  })

  it('invalid password', () => {
    expect(validate({...valid, password: null})).to.have.property('password')
    expect(validate({...valid, password: ''})).to.have.property('password')
  })

  it('valid form', () => {
    expect(validate(valid)).to.be.empty
  })
}) 