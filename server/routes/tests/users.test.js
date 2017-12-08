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
    const url = '/api/users/'

    it ('returns 401 with no authentication', () => {
      return request(app)
        .get(url + '1')
        .expect(401)
    })

    it ('returns 400 on invalid param', async () => {
      const user = await util.addUser(app)
      return request(app)
        .get(url + 'dog')
        .set('Cookie', user.cookie)
        .expect(400)
    })

    it ('returns 404 when user does not exist', async () => {
      const user = await util.addUser(app)
      return request(app)
        .get(url + '1')
        .set('Cookie', user.cookie)
        .expect(404)
    })



    it ('returns 403 with no permission', async () => {
      const {user1, user2} = await util.addTwoUsers(app)

      return request(app)
        .get(url + user1.data.id)
        .set('Cookie', user2.cookie)
        .expect(403)
    })

    it ('returns 200 with json when user exists', async () => {
      const user = await util.addUser(app)

      return request(app)
        .get(url + user.data.id)
        .set('Cookie', user.cookie)
        .expect(200)
        .then(res => {
          assert.property(res.body, 'data')
        })
    })
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
    const url = id => `/api/users/${id}`
    const updatedUser = {
      email: 'newemail@test.com'
    }

    it ('checks csrf', async () => {
      return request(app)
        .post(url(1))
        .expect(401)
    })

    it ('checks authentication', async () => {
      const csrf = await util.authUser(app)
      return request(app)
        .post(url(0))
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(401)
    })

    it ('validates body', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(0))
        .send({email: 'test'})
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(400)
        .then(res => {
          assert.property(res.body, 'errors')
        })
    })

    it ('returns 404 if user does not exist', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(0))
        .send(updatedUser)
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(404)
    })
    
    it ('checks permission', async () => {
      const csrf = await util.authUser(app)
      const {user1, user2} = await util.addTwoUsers(app)
      return request(app)
        .post(url(user1.data.id))
        .send(updatedUser)
        .set('Cookie', [csrf.cookie, user2.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(403)
    })

    it ('changes email', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(user.data.id))
        .send(updatedUser)
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(200)
        .then(res => {
          return db.users.findById(user.data.id)
        })
        .then(u => {
          assert.notEqual(user.data.email, u.email)
        })
    })

    it ('changes name', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(user.data.id))
        .send({name: 'Carl'})
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(200)
        .then(res => {
          return db.users.findById(user.data.id)
        })
        .then(u => {
          assert.notEqual(user.data.name, u.name)
          assert.equal(user.data.email, u.email)
        })
    })
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

  describe ('POST users/:id/logout', () => {
    const url = id => `/api/users/${id}/logout`

    it ('checks csrf', () => {
      return request(app)
        .post(url(0))
        .expect(401)
    })

    it ('checks authentication', async () => {
      const csrf = await util.authUser(app)
      return request(app)
        .post(url(0))
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(401)
    })

    it ('returns 404 if user does not exist', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(0))
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(404)
    })

    it ('checks permission', async () => {
      const csrf = await util.authUser(app)
      const {user1, user2} = await util.addTwoUsers(app)
      return request(app)
        .post(url(user1.data.id))
        .set('Cookie', [csrf.cookie, user2.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(403)
    })

    it ('returns 204 on success', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(user.data.id))
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(204)
    })
  })

  describe ('POST users/:id/password', () => {
    const url = id => `/api/users/${id}/password`
    const newPass = 'newpassword'

    it ('checks csrf', () => {
      return request(app)
        .post(url(0))
        .expect(401)
    })

    it ('checks authentication', async () => {
      const csrf = await util.authUser(app)
      return request(app)
        .post(url(0))
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(401)
    })

    it ('validates body', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(0))
        .send({password: '123'})
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(400)
        .then(res => {
          assert.property(res.body, 'errors')
        })
    })

    it ('checks if user exists', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(0))
        .send({password: newPass})
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(404)
    })

    it ('checks permission', async () => {
      const csrf = await util.authUser(app)
      const {user1, user2} = await util.addTwoUsers(app)
      return request(app)
        .post(url(user1.data.id))
        .send({password: newPass})
        .set('Cookie', [csrf.cookie, user2.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(403)
    })

    it ('returns 204 on success', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      const oldUser = await db.users.findById(user.data.id)
      return request(app)
        .post(url(user.data.id))
        .send({password: newPass})
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(204)
        .then(res => {
          return db.users.findById(user.data.id)
        })
        .then(currentUser => {
          assert.notEqual(oldUser.password, currentUser.password, 'password was not changed in db')
          assert.notEqual(currentUser.password, newPass, 'password was not hashed')
        })
    })
  })

  describe ('DELETE /users/:id', () => {
    const url = id => `/api/users/${id}`

    it ('checks csrf')

    it ('checks authentication')

    it ('checks if user exists')

    it ('checks permission')

    it ('returns 204 on success')
  })
})