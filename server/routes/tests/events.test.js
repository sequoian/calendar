const request = require('supertest')
const assert = require('chai').assert
const app = require('express')()
const routes = require('..')
const db = require('../../db')
app.use('/', routes)

describe ('event routes', () => {

})