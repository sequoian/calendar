const request = require('supertest')
const expect = require('chai').expect
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

const validEvent = {
  title: 'Dentist Appointment',
  day: 'January 25, 2018',
  time: '2:30',
  location: 'Dentist Office',
  description: ':('
}
const invalidEvent = Object.assign({}, validEvent, {title: null})

const addEvent = (title, owner) => {
  return db.events.add({
    title,
    owner,
    day: 'January 1, 2018',
    time: '00:00',
    location: null,
    description: 'Testing'
  })
}

describe ('event routes', () => {
  beforeEach('clear tables', async () => {
    await db.users.clearTable()
    await db.events.clearTable()
  })

  describe ('GET events', () => {
    const url = '/api/events'

    it ('checks authentication', () => {
      return request(app)
        .get(url)
        .expect(401)
    })

    it ('gets all events belonging to user', async () => {
      const user = await util.addUser(app)
      await addEvent('Test', user.data.id)

      return request(app)
        .get(url)
        .set('Cookie', user.cookie)
        .expect(200)
        .then(res => {
          const events = res.body.data.events
          expect(events).to.have.length(1)
        })
    })

    it ('returns empty array when no events', async () => {
      const user = await util.addUser(app)

      return request(app)
        .get(url)
        .set('Cookie', user.cookie)
        .expect(200)
        .then(res => {
          const events = res.body.data.events
          expect(events).to.have.length(0)
        })
    })
  })

  describe ('GET events/:id', () => {
    const url = id => `/api/events/${id}`

    it ('checks authentication', () => {
      return request(app)
        .get(url(0))
        .expect(401)
    })

    it ('checks if event exists', async () => {
      const user = await util.addUser(app)

      return request(app)
        .get(url(0))
        .set('Cookie', user.cookie)
        .expect(404)
    })

    it ('checks permission', async () => {
      const {user1, user2} = await util.addTwoUsers(app)
      const event = await addEvent('Test', user1.data.id)

      return request(app)
        .get(url(event.id))
        .set('Cookie', user2.cookie)
        .expect(403)
    })

    it ('gets event', async () => {
      const user = await util.addUser(app)
      const event = await addEvent('Test', user.data.id)
      
      return request(app)
        .get(url(event.id))
        .set('Cookie', user.cookie)
        .expect(200)
        .then(res => {
          expect(res.body.data.event.id).to.equal(event.id)
        })  
    })
  })

  describe ('POST events', () => {
    const url = '/api/events'

    it ('checks csrf', () => {
      return request(app)
        .post(url)
        .expect(401)
    })

    it ('checks authentication', async () => {
      const csrf = await util.authUser(app)
      return request(app)
        .post(url)
        .set('Cookie', csrf.cookie)
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(401)
    })

    it ('validates body', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url)
        .send(invalidEvent)
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(400)
        .then(res => {
          expect(res.body.errors.title).to.exist
        })
    })

    it ('adds event to db', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url)
        .send(validEvent)
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(200)
        .then(res => {
          expect(res.body.data.event.title).to.equal(validEvent.title)
          expect(res.body.data.event.owner).to.equal(user.data.id)
        })
    })
  })

  describe.only ('POST events/:id', () => {
    const url = id => `/api/events/${id}`

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
        .send(invalidEvent)
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(400)
        .then(res => {
          expect(res.body.errors.title).to.exist
        })
    })

    it ('checks if event exists', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      return request(app)
        .post(url(0))
        .send(validEvent)
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(404)
    })

    it ('checks permission', async () => {
      const csrf = await util.authUser(app)
      const {user1, user2} = await util.addTwoUsers(app)
      const title = 'Test'
      const event = await addEvent(title, user1.data.id)
      return request(app)
        .post(url(event.id))
        .send(validEvent)
        .set('Cookie', [csrf.cookie, user2.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(403)
    })

    it ('updates event in db', async () => {
      const csrf = await util.authUser(app)
      const user = await util.addUser(app)
      const title = 'Test'
      const event = await addEvent(title, user.data.id)
      return request(app)
        .post(url(event.id))
        .send(validEvent)
        .set('Cookie', [csrf.cookie, user.cookie])
        .set('X-CSRF-TOKEN', csrf.token)
        .expect(200)
        .then(res => {
          const newEvent = res.body.data.event
          expect(newEvent.id).to.equal(event.id)
          expect(newEvent.title).to.equal(validEvent.title)
          expect(newEvent.owner).to.equal(user.data.id)
        })
    })
  })

  describe ('DELETE events/:id', () => {
    it ('checks csrf')

    it ('checks authentication')

    it ('checks if event exists')

    it ('checks permission')

    it ('deletes event from db')
  })
})