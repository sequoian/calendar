const should = require('chai').should()
const validate = require('../validate')

describe('util validate', () => {
  it('exists', () => {
    const exists = validate.exists
    exists(undefined).should.be.false
    exists(null).should.be.false
    exists('').should.be.true
    exists(false).should.be.true
  })
})