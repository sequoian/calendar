const should = require('chai').should()
const validate = require('../../validation')

describe('event form validation', () => {
  const date = new Date()
  const dateJson = date.toJSON()
  const valid = {
    title: 'Dentist Appointment',
    day: dateJson,
    time: '2:30',
    location: 'Dentist Office',
    description: ':('
  }
  const validWithEmptys = {
    title: 'Test Event',
    day: '',
    time: '',
    location: '',
    description: '',
  }

  it('invalid title', () => {
      const values = Object.assign({}, valid)
      values.title = null
      validate(values).should.have.property('title')
      values.title = ' '
      validate(values).should.have.property('title')
  })

  it('invalid day', () => {
    const values = Object.assign({}, valid)
    values.day = '2018-01-33'
    validate(values).should.have.property('day')
    values.day = undefined
    validate(values).should.have.property('day')
  })

  it('invalid time', () => {
    const values = Object.assign({}, valid)
    values.time = undefined
    validate(values).should.have.property('time')
    values.time = 11
    validate(values).should.have.property('time')
    values.time = ''
    // empty strings are okay
    validate(values).should.be.empty
  })

  it('invalid location', () => {
    const values = Object.assign({}, valid)
    values.location = undefined
    validate(values).should.have.property('location')
    values.location = 12
    validate(values).should.have.property('location')
  })

  it('invalid description', () => {
    const values = Object.assign({}, valid)
    values.description = undefined
    validate(values).should.have.property('description')
    values.description = 12
    validate(values).should.have.property('description')
  })

  it('valid form', () => {
    validate(valid).should.be.empty
    validate(validWithEmptys).should.be.empty
  })
}) 