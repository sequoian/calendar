const request = require('supertest')
const expect = require('chai').expect
const routes = require('../../routes')
const db = require('../../../db')
const util = require('../../../util/testing')
const app = util.prepareApp(routes)

describe('user auth routes', () => {
  beforeEach('clear users', () => {
    return db.users.clearTable()
  })

  describe.only('POST users/signup', () => {
    const url = '/api/users/signup'
    const reqBody = {
      email: 'test@test.com',
      password: 'testpassword',
      name: 'Test'
    }

    let csrf
    before('get csrf token', async () => {
      csrf = await util.authUser(app)
    })

    it('requires csrf token', async () => {
      return request(app)
        .post(url)
        .set('Cookie', csrf.cookie)
        .expect(401)
    })

    it('validates body', () => {
      const body = Object.assign({}, reqBody, {email: 'invalid'})
      return request(app)
        .post(url)
        .send(body)
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(400)
        .then(res => {
          expect(res.body.errors).to.exist
        })
    })

    it('returns 200 with user data', () => {
      return request(app)
        .post(url)
        .send(reqBody)
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(200)
        .then(res => {
          expect(res.body.data).to.exist
          expect(res.header['set-cookie']).to.exist
          return db.users.findByEmail(reqBody.email)
        })
        .then(user => {
          expect(user).to.exist
        })
    })
  })

  describe('POST users/login', () => {
    const url = '/api/users/login'
    const reqBody = {
      email: 'test@test.com',
      password: 'testpassword'
    }
    let csrf
    
    before('get csrf token', async () => {
      csrf = await util.authUser(app)
    })

    it('requires csrf token', async () => {
      return request(app)
        .post(url)
        .set('Cookie', csrf.cookie)
        .expect(401)
    })

    it('requires request body', () => {
      return request(app)
        .post(url)
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(400)
        .then(res => {
          assert.property(res.body, 'errors')
        })
    })

    it('validates body', () => {
      const body = Object.assign({}, reqBody, {email: ''})
      return request(app)
        .post(url)
        .send(body)
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(400)
        .then(res => {
          assert.property(res.body, 'errors')
        })
    })

    it('returns errors when user is not in db', () => {
      return request(app)
        .post(url)
        .send(reqBody)
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(400)
        .then(res => {
          assert.property(res.body, 'errors')
        })
    })

    it('returns 200 with user data', async () => {
      await request(app)
        .post('/api/users/signup')
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .send(reqBody)

      return request(app)
        .post(url)
        .send(reqBody)
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(200)
        .then(res => {
          assert.property(res.body, 'data')
          assert.property(res.body.data, 'user', 'no user data')
          assert.exists(res.header['set-cookie'], 'cookie not set')
        })
    })
  })

  describe('POST users/:id/logout', () => {
    const url = id => `/api/users/${id}/logout`

    it('checks csrf', () => {
      return request(app)
        .post(url(0))
        .expect(401)
    })

    it('checks authentication', async () => {
      const csrf = await util.authUser(app)
      return request(app)
        .post(url(0))
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(401)
    })

    it('returns 404 if user does not exist', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(0))
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(404)
    })

    it('checks permission', async () => {
      const csrf = await util.authUser(app)
      const {user1, user2} = await util.addTwoUsers(app)
      return request(app)
        .post(url(user1.data.id))
        .set('Cookie', [csrf.cookie, user2.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(403)
    })

    it('returns 204 on success', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(user.data.id))
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(204)
        .then(res => {
          assert.exists(res.header['set-cookie'])
        })
    })
  })
})