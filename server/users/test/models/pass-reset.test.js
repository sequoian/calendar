const expect = require('chai').expect
const db = require('../../../db')

const validUser = {
  name: 'Moe',
  email: 'moe@test.com',
  password: 'abc123'
}

describe.only('password reset model', () => {
  let user

  // hooks

  before('add user', async () => {
    await db.users.clearTable()
    user = await db.users.add(validUser)
    expect(user.email).to.equal(validUser.email)
    await db.passreset.clearTable()
  })

  after('clear users', async () => {
    await db.users.clearTable()
    await db.passreset.clearTable()
  })

  // tests
  let reset

  it('init reset', async () => {
    reset = await db.passreset.initReset(user.id)
    expect(reset.user_id).to.equal(user.id)
  })

  it('find by id', async () => {
    const result = await db.passreset.findById(reset.id)
    expect(result.id).to.equal(reset.id)
  })

  it('clear by id', async () => {
    await db.passreset.clearById(reset.id)
    const result = await db.passreset.findById(reset.id)
    expect(result).to.be.null
  })
})