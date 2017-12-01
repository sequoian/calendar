const should = require('chai').should()
const db = require('../../db')
const jwt = require('../jwt')

describe ('security', () => {
  describe ('jwt', () => {
    const userData = {
      email: 'test@test.com',
      password: 'testing',
      name: null
    }

    beforeEach('clear user table', () => {
      return db.users.clearTable()
    })

    it ('signs user token', async () => {
      const user = await db.users.add(userData)
      should.not.exist(jwt.createUserToken('invalid'))
      jwt.createUserToken(user).should.be.string
    })

    describe ('gets user from jwt', () => {
      it ('succeeds on valid token', async () => {
        const userFromDb = await db.users.add(userData)
        const token = jwt.createUserToken(userFromDb)
        const user = await jwt.getUserFromToken(token)
        should.exist(user)
        user.should.have.property('id')
        user.id.should.be.equal(userFromDb.id)
      })

      it ('fails on invalid token', async () => {
        should.not.exist(await jwt.getUserFromToken('invalid'))
      })
  
      it ('fails when user does not exist', async () => {
        const userFromDb = await db.users.add(userData)
        const validToken = jwt.createUserToken(userFromDb)
        await db.users.remove(userFromDb.id)  // remove user
        const user = await jwt.getUserFromToken(validToken)
        should.not.exist(user)
      })
    })
  })
})