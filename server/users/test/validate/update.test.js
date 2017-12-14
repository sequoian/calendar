const expect = require('chai').expect
const validate = require('../../validate/update').validateUpdate
const valPass = require('../../validate/update').validatePasswordUpdate

describe('user update validation', () => {
  it('email', async () => {
    expect(await validate({email: 'test'})).to.have.property('email')
    expect(validate({email: 'test@test.com'})).to.be.empty
  })

  it('name', async () => {
    expect(await validate({name: '  '})).to.have.property('name')
    expect(await validate({name: 'Joe'})).to.be.empty
  })

  it('multiple fields', async () => {
    const valid = {
      email: 'test@test.com',
      name: 'Joe'
    }
    expect(await validate(valid)).to.be.empty
  })

  it('password', () => {
    const body = {password: ''}
    expect(valPass(body)).to.have.property('password')
    body.password = 'testpassword'
    expect(valPass(body)).to.be.empty
  })
})