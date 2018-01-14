const request = require('supertest')
const expect = require('chai').expect
const routes = require('../../routes')
const db = require('../../../db')
const util = require('../../../util/testing')
const app = util.prepareApp(routes)

const user = {
  email: process.env.EMAIL,
  password: 'testpassword',
  name: 'Joe'
}

describe('password reset routes', () => {
  beforeEach('clear tables', async () => {
    await db.users.clearTable()
    await db.passreset.clearTable()
  })

  after('clear tables', async () => {
    await db.users.clearTable()
    await db.passreset.clearTable()
  })

  describe('GET reset-password/check', () => {
    const url = '/api/reset-password/check'
    it('requries id', () => {
      return request(app)
        .get(url)
        .expect(400)
    })

    it('works', async () => {
      const u = await db.users.add(user)
      const reset = await db.passreset.initReset(u.id)
      return request(app)
        .get(url + '?id=' + reset.id)
        .expect(204)
    })
  })

  describe('POST reset-password/confirm', () => {
    const url = '/api/reset-password/confirm'
    let csrf

    it('fails when email does not exist', async () => {
      csrf = await util.authUser(app)
      return request(app)
        .post(url)
        .send({email: user.email})
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(404)
    })

    it('works', async function() {
      this.timeout(3000) // extend timeout, sending email takes a while
      await db.users.add(user)
      return request(app)
        .post(url)
        .send({email: user.email})
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(204)
    })
  })

  describe('POST reset-password/update', () => {
    const url = '/api/reset-password/update'
    it('works', async () => {
      const u = await db.users.add(user)
      const reset = await db.passreset.initReset(u.id)
      const csrf = await util.authUser(app)
      const password = 'newpassword'
      return request(app)
        .post(url + '?id=' + reset.id)
        .send({password})
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(204)
    })
  })

})