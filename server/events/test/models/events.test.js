const assert = require('chai').assert
const db = require('../../../db')

const appt = {
  title: 'Dentist Appointment',
  day: '2020-03-25',
  time: '2:30',
  location: '123 Test Blvd, Orange, CA',
  description: 'Do not be late',
}

const unscheduled = {
  title: 'Clean car',
  day: null,
  time: null,
  location: null,
  description: null
}

const owner = {
  email: 'test',
  password: 'test',
  name: 'test'
}

describe('events repo', () => {
  before('clear events and add user', async () => {
    await db.events.clearTable()
    const user = await db.users.add(owner)
    owner.id = user.id
    appt.owner = user.id
    unscheduled.owner = user.id
  })

  let event

  it ('add event', async () => {
    event = await db.events.add(appt)
    assert.isObject(appt)
  })

  it ('find by id', async () => {
    const result = await db.events.findById(event.id)
    assert.isObject(result)
  })

  it ('update event', async () => {
    const newTime = '7:00'
    const updated = Object.assign({}, event, {time: newTime})
    event = await db.events.update(updated)
    assert.isObject(event)
    assert.strictEqual(event.time, newTime)
  })
  
  it ('all user events', async () => {
    await db.events.add(unscheduled)
    const events = await db.events.findAllByUser(owner.id)
    assert.lengthOf(events, 2)
  })

  it ('remove event', async () => {
    const result = await db.events.remove(event.id)
    assert.strictEqual(result, 1)
    const e = await db.events.findById(event.id)
    assert.notExists(e, 'remove did not work correctly')
  })

  after('clear users', async () => {
    await db.events.clearTable()
    await db.users.clearTable()
  })
})