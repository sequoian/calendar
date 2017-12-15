const request = require('supertest')
const expect = require('chai').expect
const routes = require('../../routes')
const db = require('../../../db')
const util = require('../../../util/testing')
const app = util.prepareApp(routes)

describe('user GET routes', () => {
  beforeEach('clear users', () => {
    return db.users.clearTable()
  })

  describe('GET users', () => {
    it('returns 400 without params', () => {
      return request(app)
        .get('/api/users')
        .expect(400)
    })
      
    it('returns 400 with invalid params', () => {
      return request(app)
        .get('/api/users?invalid=test')
        .expect(400)
    })
      
    it('returns 404 when email does not exist', () => {
      return request(app)
        .get('/api/users?email=test@test.com')
        .expect(404)
    })

    it('returns 204 when email exists', async () => {
      const email = 'test@test.com'
      await db.users.add({
        email,
        password: '123',
        name: 'jack'
      })

      return request(app)
        .get(`/api/users?email=${email}`)
        .expect(204)
    })
  })

  describe('GET users/:id', () => {
    const url = id => `/api/users/${id}`

    it('returns 401 with no authentication', () => {
      return request(app)
        .get(url(0))
        .expect(401)
    })

    it('returns 400 on invalid param', async () => {
      const user = await util.addUser(app)
      return request(app)
        .get(url('dog'))
        .set('Cookie', user.cookie)
        .expect(400)
    })

    it('returns 404 when user does not exist', async () => {
      const user = await util.addUser(app)
      return request(app)
        .get(url(0))
        .set('Cookie', user.cookie)
        .expect(404)
    })

    it('returns 403 with no permission', async () => {
      const {user1, user2} = await util.addTwoUsers(app)

      return request(app)
        .get(url(user1.data.id))
        .set('Cookie', user2.cookie)
        .expect(403)
    })

    it('returns 200 with json when user exists', async () => {
      const user = await util.addUser(app)

      return request(app)
        .get(url(user.data.id))
        .set('Cookie', user.cookie)
        .expect(200)
        .then(res => {
          expect(res.body.data).to.exist
        })
    })
  })
})