const assert = require('chai').assert
const db = require('..')

const moe = {
  name: 'Moe',
  email: 'moe@test.com',
  password: 'abc123'
}

describe('user repo', () => {
  before('clear users', () => {
    return db.users.clearTable()
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

  it ('find by email', async () => {
    let result = await db.users.findByEmail(user.email)
    assert.isObject(result)
    assert.strictEqual(result.email, user.email)
    result = await db.users.findByEmail('missing')
    assert.notExists(result, 'found email that does not exist')
  })

  it ('update user', async () => {
    const newEmail = 'new@test.com'
    const updated = Object.assign({}, user, {email: newEmail})
    user = await db.users.update(updated)
    assert.isObject(user)
    assert.strictEqual(user.email, newEmail)
  })

  it ('remove user', async () => {
    const result = await db.users.remove(user.id)
    assert.strictEqual(result, 1)
    const u = await db.users.findById(user.id)
    assert.notExists(u, 'remove did not work correctly')
  })
})