const should = require('chai').should()
const validate = require('../index').events

describe ('event form validation', () => {
  const date = new Date()
  const dateJson = date.toJSON()
  const valid = {
    title: 'Dentist Appointment',
    day: dateJson,
    time: '2:30',
    location: 'Dentist Office',
    description: ':('
  }
  const validWithNulls = {
    title: 'Test Event',
    day: null,
    time: null,
    location: null,
    description: null,
  }

  it ('invalid title', () => {
      const values = Object.assign({}, valid)
      values.title = null
      validate(values).should.have.property('title')
      values.title = ' '
      validate(values).should.have.property('title')
  })

  it ('invalid day', () => {
    const values = Object.assign({}, valid)
    const bad = new Date('2018-01-33')
    const badJson = bad.toJSON()
    values.day = badJson
    // .toJSON() transforms date into null, but it still works out
    validate(values).should.be.empty
    values.day = '2018-01-33'
    validate(values).should.have.property('day')
    values.day = undefined
    validate(values).should.have.property('day')
    values.day = ''
    validate(values).should.have.property('day')
  })

  it ('invalid time', () => {
    const values = Object.assign({}, valid)
    values.time = undefined
    validate(values).should.have.property('time')
    values.time = 11
    validate(values).should.have.property('time')
    values.time = ''
    // empty strings are okay
    validate(values).should.be.empty
  })

  it ('invalid location', () => {
    const values = Object.assign({}, valid)
    values.location = undefined
    validate(values).should.have.property('location')
    values.location = 12
    validate(values).should.have.property('location')
  })

  it ('invalid description', () => {
    const values = Object.assign({}, valid)
    values.description = undefined
    validate(values).should.have.property('description')
    values.description = 12
    validate(values).should.have.property('description')
  })

  it ('valid form', () => {
    validate(valid).should.be.empty
    validate(validWithNulls).should.be.empty
  })
}) 