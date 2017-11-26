const assert = require('chai').assert
const db = require('..')

const appt = {
  title: 'Dentist Appointment',
  day: '2020-03-25',
  time: '2:30',
  location: '123 Test Blvd, Orange, CA',
  description: 'Do not be late',
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
    appt.owner = user.id
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

  it ('remove event', async () => {
    const result = await db.events.remove(event.id)
    assert.strictEqual(result, 1)
    const e = await db.events.findById(event.id)
    assert.notExists(e, 'remove did not work correctly')
  })

  after('clear users', () => {
    return db.users.clearTable()
  })
})