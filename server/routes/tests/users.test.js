const request = require('supertest')
const assert = require('chai').assert
const app = require('express')()
const routes = require('..')
const db = require('../../db')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const util = require('./util')

// Prepare app
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_KEY))
app.use('/', routes)


describe ('user routes', () => {
  beforeEach('clear users', () => {
    return db.users.clearTable()
  })

  describe ('GET users', () => {
    it ('returns 400 without params', () => {
      return request(app)
        .get('/api/users')
        .expect(400)
    })
      
    it ('returns 400 with invalid params', () => {
      return request(app)
        .get('/api/users?invalid=test')
        .expect(400)
    })
      
    it ('returns 404 when email does not exist', () => {
      return request(app)
        .get('/api/users?email=test@test.com')
        .expect(404)
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

  describe ('GET users/:id', () => {
    it ('returns 404 when user does not exist')
    it ('returns 401 without authentication')
    it ('returns 401 with invalid authentication')
    it ('returns 403 with no permission')
    it ('returns 200 with json when user exists')
  })

  describe ('POST users/signup', () => {
    const url = '/api/users/signup'
    const reqBody = {
      email: 'test@test.com',
      password: 'testpassword'
    }
    let csrf
    
    before('get csrf token', async () => {
      csrf = await util.authUser(app)
    })

    it ('requires csrf token', async () => {
      return request(app)
        .post(url)
        .set('Cookie', csrf.cookie)
        .expect(401)
    })

    it ('requires body', () => {
      return request(app)
        .post(url)
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(400)
        .then(res => {
          assert.property(res.body, 'errors')
        })
    })

    it ('validates body', () => {
      const body = Object.assign({}, reqBody, {email: 'invalid'})
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

    it ('returns errors on duplicate email', async () => {
      await db.users.add({
        email: reqBody.email,
        password: 'testpassword',
        name: 'jack'
      })

      return request(app)
        .post(url)
        .send(reqBody)
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(400)
        .then(res => {
          assert.property(res.body, 'errors')
          assert.property(res.body.errors, 'email')
        })
    })

    it ('stores in database and hashes password', () => {
      return request(app)
        .post(url)
        .send(reqBody)
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(200)
        .then(res => {
          return db.users.findByEmail(reqBody.email)
        })
        .then(user => {
          assert.isObject(user, 'not stored in database')
          // password should be a string and not an empty one
          assert(user.password.length > 0, 'password not stored correctly')
          assert.notEqual(user.password, reqBody.password, 'password not hashed')
        })
    })

    it ('returns 200 with user data', () => {
      return request(app)
        .post(url)
        .send(reqBody)
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(200)
        .then(res => {
          assert.property(res.body, 'data')
          assert.property(res.body.data, 'user')
          assert.exists(res.header['set-cookie'], 'cookie not set')
        })
    })
  })

  describe ('POST users/login', () => {
    const url = '/api/users/login'
    const reqBody = {
      email: 'test@test.com',
      password: 'testpassword'
    }
    let csrf
    
    before('get csrf token', async () => {
      csrf = await util.authUser(app)
    })

    it ('requires csrf token', async () => {
      return request(app)
        .post(url)
        .set('Cookie', csrf.cookie)
        .expect(401)
    })

    it ('requires request body', () => {
      return request(app)
        .post(url)
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(400)
        .then(res => {
          assert.property(res.body, 'errors')
        })
    })

    it ('validates body', () => {
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

    it ('returns errors when user is not in db', () => {
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

    it ('returns 200 with user data', async () => {
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

  describe ('POST users/:id', () => {

  })

  describe ('POST users/auth', () => {
    const url = '/api/users/auth'

    it ('returns 401 with csrf token when user is not logged in', () => {
      return request(app)
        .post(url)
        .expect(401)
    })

    it ('returns 200 with data and csrf token when user is logged in', async () => {
      const user = await util.addUser(app)

      return request(app)
        .post(url)
        .set('Cookie', user.cookie)
        .expect(200)
        .then(res => {
          assert.property(res.body, 'data')
        })
    })
  })

  describe ('POST users/logout', () => {

  })

  describe ('POST users/:id/password', () => {

  })

  describe ('DELETE /users/:id', () => {
    
  })
})