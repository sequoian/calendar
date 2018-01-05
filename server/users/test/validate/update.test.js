const db = require('../../../db')
const expect = require('chai').expect
const validate = require('../../validate/update').validateUpdate
const valPass = require('../../validate/update').validatePasswordUpdate

describe('user update validation', () => {
  before('clear users', () => {
    db.users.clearTable()
  })

  it('email', async () => {
    expect(await validate({email: 'test', id: '1'})).to.have.property('email')
    expect(await validate({email: 'test@test.com', id: '1'})).to.be.empty
  })

  it('name', async () => {
    expect(await validate({name: '  ', id: '1'})).to.have.property('name')
    expect(await validate({name: 'Joe', id: '1'})).to.be.empty
  })

  it('multiple fields', async () => {
    const valid = {
      id: '1',
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