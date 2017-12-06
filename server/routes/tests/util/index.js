const request = require('supertest')
const parseCookie = require('cookie').parse

/**
 * Gets csrf cookie and token from auth route
 */
const authUser = (app) => {
  return request(app)
    .post('/api/users/auth')
    .then(res => {
      const cookie = res.header['set-cookie'][0]
      const token = parseCookie(cookie).csrf
      return {
        cookie,
        token
      }
    })
}

/**
 * Creates user through the signup route.
 * Returns jwt cookie and user data
 */
const addUser = async (app) => {
  const body = {
    email: 'test@test.com',
    password: 'testpassword'
  }

  const csrf = await authUser(app)

  return request(app)
    .post('/api/users/signup')
    .send(body)
    .set('Cookie', csrf.cookie)
    .set('X-CSRF-TOKEN', csrf.token)
    .then(res => {
      const cookie = res.header['set-cookie'][0]
      const data = res.body.data.user
      return {
        cookie,
        data
      }
    })
}

module.exports = {
  authUser,
  addUser
}