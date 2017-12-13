const expect = require('chai').expect
const db = require('..')

const moe = {
  name: 'Moe',
  email: 'moe@test.com',
  password: 'abc123'
}

describe('user repo', () => {
  beforeEach('clear users', async () => {
    await db.users.clearTable()
  })

  it('add user', async () => {
    const user = await db.users.add(moe)
    expect(user.email).to.equal(moe.email)
  })

  it('find by id', async () => {
    const user = await db.users.add(moe)
    const result = await db.users.findById(user.id)
    expect(result.email).to.equal(user.email)
  })

  it('find by email', async () => {
    const user = await db.users.add(moe)
    const result = await db.users.findByEmail(user.email)
    expect(result.id).to.equal(user.id)
  })

  it('check password', async () => {
    const user = await db.users.add(moe)
    // correct password
    let result = await db.users.checkPassword(user.id, moe.password)
    expect(result).to.be.true
    // incorrect password
    result = await db.users.checkPassword(user.id, 'wrongpass')
    expect(result).to.be.false
  })

  it('update user', async () => {
    const user = await db.users.add(moe)
    const update = Object.assign({}, user, {
      email: 'newmail@test.com'
    })
    const updatedUser = await db.users.update(update)
    expect(updatedUser.email).to.equal(update.email)
  })

  it('update password', async () => {
    const user = await db.users.add(moe)
    const newPass = 'newpassword'
    const updated = await db.users.updatePassword(user.id, newPass)
    expect(updated).to.equal(1)
    // check password
    const result = await db.users.checkPassword(user.id, newPass)
    expect(result).to.be.true
  })

  it('remove user', async () => {
    const user = await db.users.add(moe)
    const result = await db.users.remove(user.id)
    expect(result).to.equal(1)
    // look for user
    const missing = await db.users.findById(user.id)
    expect(missing).to.be.null
  })
})