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

describe.only ('event routes', () => {

  describe ('GET events', () => {
    it ('checks authentication')

    it ('checks permission')

    it ('gets all events belonging to user')

    it ('returns empty array when no events')
  })

  describe ('GET events/:id', () => {
    it ('checks authentication')

    it ('checks permission')

    it ('checks if event exists')

    it ('gets event')
  })

  describe ('POST events', () => {
    it ('checks csrf')

    it ('checks authentication')

    it ('validates body')

    it ('adds event to db')
  })

  describe ('POST events/:id', () => {
    it ('checks csrf')

    it ('checks authentication')

    it ('validates body')

    it ('checks if event exists')

    it ('checks permission')

    it ('updates event in db')
  })

  describe ('DELETE events/:id', () => {
    it ('checks csrf')

    it ('checks authentication')

    it ('checks if event exists')

    it ('checks permission')

    it ('deletes event from db')
  })
})