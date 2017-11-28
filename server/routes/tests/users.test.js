const request = require('supertest')
const assert = require('chai').assert
const app = require('express')()
const routes = require('..')
const db = require('../../db')
app.use('/', routes)

describe ('user routes', () => {
  beforeEach('clear users', () => {
    return db.users.clearTable()
  })

  describe ('GET /api/users', () => {
    it ('returns 400 without params', (done) => {
      request(app)
        .get('/api/users')
        .expect(400, done)
    })
      
    it ('returns 400 with invalid params', (done) => {
      request(app)
        .get('/api/users?invalid=test')
        .expect(400, done)
    })
      
    it ('returns 404 when email does not exist', (done) => {
      request(app)
        .get('/api/users?email=test@test.com')
        .expect(404, done)
    })

    it ('returns 204 when email exists', async () => {
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

  describe ('GET /api/users/:id', () => {
    it ('returns 404 when user does not exist')
    it ('returns 401 without authentication')
    it ('returns 401 with invalid authentication')
    it ('returns 403 with no permission')
    it ('returns 200 with json when user exists')
  })

  describe ('POST /api/users/signup', () => {
    const url = '/api/users/signup'
    const reqbody = {
      data: {
        email: 'test@test.com',
        password: 'testpassword',
        confirmPass: 'testpassword'
      }
    }

    it ('returns errors with no body', () => {
      return request(app)
        .post(url)
        .expect(400)
        .then(res => {
          assert.property(res.body, 'errors')
        })
    })

    it ('returns errors when a value is an incorrect type', () => {
      const body = Object.assign({}, reqbody, {email: 12})
      return request(app)
        .post(url)
        .send(body)
        .expect(400)
        .then(res => {
          assert.property(res.body, 'errors')
        })
    })

    it ('returns errors when email is invalid', () => {
      const body = Object.assign({}, reqbody, {email: 'invalid'})
      return request(app)
        .post(url)
        .send(body)
        .expect(400)
        .then(res => {
          assert.property(res.body, 'errors')
        })
    })

    it ('returns errors when password is not the correct length', () => {
      const body = Object.assign({}, reqbody, {password: '123'})
      return request(app)
        .post(url)
        .send(body)
        .expect(400)
        .then(res => {
          assert.property(res.body, 'errors')
        })
    })

    it ('returns errors with errors when passwords do not match', () => {
      const body = Object.assign({}, reqbody, {confirmPass: 'different'})
      return request(app)
        .post(url)
        .send(body)
        .expect(400)
        .then(res => {
          assert.property(res.body, 'errors')
        })
    })

    it ('returns 200 with data', () => {
      return request(app)
        .post(url)
        .send(reqbody)
        .expect(200)
        .then(res => {
          assert.property(res.body, 'data')
        })
    })
  })

  describe ('POST /api/users/login', () => {
    it ('returns 400 with no body')
    it ('returns errors when values are empty')
    it ('returns errors when values are incorrect type')
    it ('returns 200 with data')
  })

  describe ('POST /api/users/:id', () => {

  })

  describe ('POST /api/users/:id/password', () => {

  })

  describe ('DELETE /api/users/:id', () => {
    
  })
})