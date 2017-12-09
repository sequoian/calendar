const should = require('chai').should()
const v = require('.')

describe ('validation tests', () => {
  it ('exists', () => {
    v.exists(undefined).should.be.false
    v.exists(null).should.be.true
    v.exists(false).should.be.true
    v.exists({}).should.be.true
    v.exists([]).should.be.true
    v.exists('hello').should.be.true
  })

  it ('is string', () => {
    v.isString(undefined).should.be.false
    v.isString(null).should.be.false
    v.isString(true).should.be.false
    v.isString(5).should.be.false
    v.isString('5').should.be.true
  })

  it ('is valid email', () => {
    v.validEmail(undefined).should.be.false
    v.validEmail(null).should.be.false
    v.validEmail('test').should.be.false
    v.validEmail('test@').should.be.false
    v.validEmail('test@test').should.be.false
    v.validEmail('test@test.').should.be.false
    v.validEmail('test@test.c').should.be.false
    v.validEmail('test@test.com').should.be.true
  })

  it ('is empty', () => {
    v.isEmpty({}).should.be.true
    v.isEmpty([]).should.be.true
    v.isEmpty('').should.be.true
    v.isEmpty(undefined).should.be.false
    v.isEmpty(null).should.be.false
    v.isEmpty(5).should.be.false
    v.isEmpty(' ').should.be.false
    v.isEmpty(false).should.be.false
    v.isEmpty({test: undefined}).should.be.false
    v.isEmpty([undefined]).should.be.false
    v.isEmpty([1]).should.be.false
  })

  it ('is date', () => {
    v.isDate(new Date('2018-01-31')).should.be.true
    v.isDate(new Date()).should.be.true
    v.isDate(new Date(50)).should.be.true
    v.isDate(new Date('2018-01-32')).should.be.false
    v.isDate(new Date('test')).should.be.false
    v.isDate().should.be.false
    v.isDate(null).should.be.false
    v.isDate('2018-01-31').should.be.false
    v.isDate(50).should.be.false
  })
})