const should = require('chai').should()
const jwt = require('../jwt')

describe ('security', () => {
  describe ('jwt', () => {
    const user = {id: 55}
    let token

    it ('signs user token', () => {
      token = jwt.createUserToken(user)
      token.should.exist
    })

    it ('gets user from jwt', () => {
      should.not.exist(jwt.getUserFromToken('invalid'))
      should.not.exist(jwt.getUserFromToken({}))
      jwt.getUserFromToken(token).should.equal(55)
    })
  })
})