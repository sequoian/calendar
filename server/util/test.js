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
const addUser = async (app, user) => {
  const body = user || {
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

const addTwoUsers = async app => {
  const user1 = await addUser(app)
  const user2 = await addUser(app, {
    email: 'second@test.com',
    password: 'testingsecond'
  })

  return {
    user1,
    user2
  }
}

module.exports = {
  authUser,
  addUser,
  addTwoUsers
}