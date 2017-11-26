const assert = require('chai').assert
const db = require('..')

const moe = {
  name: 'Moe',
  email: 'moe@test.com',
  password: 'abc123'
}

describe('user repo', () => {
  before('clear users', async () => {
    await db.users.clearTable()
  })

  let user

  it ('add user', async () => {
    user = await db.users.add(moe)
    assert.isObject(user)
  })

  it ('find by id', async () => {
    const result = await db.users.findById(user.id)
    assert.isObject(result)
  })

  it ('remove user', async () => {
    const result = await db.users.remove(user.id)
    assert.strictEqual(result, 1)
    const u = await db.users.findById(user.id)
    assert.notExists(u, 'remove did not work correctly')
  })
})