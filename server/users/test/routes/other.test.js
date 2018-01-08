const request = require('supertest')
const expect = require('chai').expect
const routes = require('../../routes')
const db = require('../../../db')
const util = require('../../../util/testing')
const app = util.prepareApp(routes)


describe('user update routes', () => {
  beforeEach('clear users', () => {
    return db.users.clearTable()
  })

  describe('POST users/:id', () => {
    const url = id => `/api/users/${id}`
    const updatedUser = {
      email: 'newemail@test.com'
    }

    it('checks csrf', async () => {
      return request(app)
        .post(url(1))
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

    it('validates body', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(0))
        .send({email: 'test'})
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(400)
        .then(res => {
          expect(res.body.errors).to.exist
        })
    })

    it('returns 404 if user does not exist', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      updatedUser.id = '0'
      return request(app)
        .post(url(0))
        .send(updatedUser)
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(404)
    })
    
    it('checks permission', async () => {
      const csrf = await util.authUser(app)
      const {user1, user2} = await util.addTwoUsers(app)
      updatedUser.id = user1.data.id + ''
      return request(app)
        .post(url(user1.data.id))
        .send(updatedUser)
        .set('Cookie', [csrf.cookie, user2.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(403)
    })

    it('changes email', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      updatedUser.id = user.data.id + ''
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
          expect(user.data.email).to.not.equal(u.email)
        })
    })

    it('changes name', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(user.data.id))
        .send({
          name: 'Carl',
          id: user.data.id + ''
        })
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(200)
        .then(res => {
          return db.users.findById(user.data.id)
        })
        .then(u => {
          expect(user.data.name).to.not.equal(u.name)
          expect(user.data.email).to.equal(u.email)
        })
    })
  })


  describe('POST users/:id/password', () => {
    const url = id => `/api/users/${id}/password`
    const newPass = 'newpassword'

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

    it('validates body', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(0))
        .send({password: '123'})
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(400)
        .then(res => {
          expect(res.body.errors).to.exist
        })
    })

    it('checks if user exists', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(0))
        .send({password: newPass})
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(404)
    })

    it('checks permission', async () => {
      const csrf = await util.authUser(app)
      const {user1, user2} = await util.addTwoUsers(app)
      return request(app)
        .post(url(user1.data.id))
        .send({password: newPass})
        .set('Cookie', [csrf.cookie, user2.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(403)
    })

    it('returns 204 on success', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      const oldUser = await db.users.findById(user.data.id)
      return request(app)
        .post(url(user.data.id))
        .send({password: newPass})
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(204)
    })
  })

  describe('DELETE /users/:id', () => {
    const url = id => `/api/users/${id}`

    it('checks csrf', () => {
      return request(app)
        .delete(url(0))
        .expect(401)
    })

    it('checks authentication', async () => {
      const csrf = await util.authUser(app)
      return request(app)
        .delete(url(0))
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(401)
    })

    it('checks if user exists', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .delete(url(0))
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(404)
    })

    it('checks permission', async () => {
      const csrf = await util.authUser(app)
      const {user1, user2} = await util.addTwoUsers(app)
      return request(app)
        .delete(url(user1.data.id))
        .set('Cookie', [csrf.cookie, user2.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(403)
    })

    it('returns 204 on success and clears cookie', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .delete(url(user.data.id))
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(204)
        .then(res => {
          expect(res.header['set-cookie']).to.exist
          return db.users.findById(user.data.id)
        })
        .then(user => {
          expect(user).to.not.exist
        })
    })
  })
})