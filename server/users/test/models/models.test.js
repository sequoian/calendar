const expect = require('chai').expect
const db = require('../../../db')

const validUser = {
  name: 'Moe',
  email: 'moe@test.com',
  password: 'abc123'
}

describe.only('user model', () => {
  let user

  // hooks

  beforeEach('add user', async () => {
    await db.users.clearTable()
    user = await db.users.add(validUser)
    expect(user.email).to.equal(validUser.email)
  })

  after('clear users', () => {
    return db.users.clearTable()
  })

  // tests

  it('find by id', async () => {
    const result = await db.users.findById(user.id)
    expect(result.email).to.equal(user.email)
  })

  it('find by email', async () => {
    const result = await db.users.findByEmail(user.email)
    expect(result.id).to.equal(user.id)
  })

  it('check password', async () => {
    // correct password
    let result = await db.users.checkPassword(user.id, validUser.password)
    expect(result).to.be.true

    // incorrect password
    result = await db.users.checkPassword(user.id, 'wrongpass')
    expect(result).to.be.false
  })

  it('update user', async () => {
    const update = Object.assign({}, user, {
      email: 'newmail@test.com'
    })
    const updatedUser = await db.users.update(update)
    expect(updatedUser.email).to.equal(update.email)
  })

  it('update password', async () => {
    const newPass = 'newpassword'
    const updated = await db.users.updatePassword(user.id, newPass)
    expect(updated).to.equal(1)

    // check password
    const result = await db.users.checkPassword(user.id, newPass)
    expect(result).to.be.true
  })

  it('remove user', async () => {
    const result = await db.users.remove(user.id)
    expect(result).to.equal(1)

    // look for user
    const missing = await db.users.findById(user.id)
    expect(missing).to.be.null
  })
})