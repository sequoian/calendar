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

  })

  describe ('POST /api/users/login', () => {

  })

  describe ('POST /api/users/:id', () => {

  })

  describe ('POST /api/users/:id/password', () => {

  })

  describe ('DELETE /api/users/:id', () => {
    
  })
})