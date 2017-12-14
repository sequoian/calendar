const expect = require('chai').expect
const db = require('../../../db')
const {
  validateEmail,
  validatePassword,
  validateName
} = require('../../validation/fields/signup')
const validateSignup = require('../../validation/signup')

describe('signup validation', () => {

  describe('fields', () => {
    const takenEmail = 'taken@test.com'
    const validForm = {
      email: 'test@test.com',
      password: 'testpassword',
      name: 'Bob'
    }
  
    // hooks
    before('add user to test email', async () => {
      await db.users.clearTable()
  
      await db.users.add({
        email: takenEmail,
        password: 'test',
        name: null
      })
    })
  
    after('clear users', () => {
      return db.users.clearTable()
    })
  
    // tests
    it('email', async () => {
      const val = validateEmail
      expect(() => val(null)).to.throw
      expect(await val('')).to.be.string
      expect(await val('test')).to.be.string
      expect(await val('test@test')).to.be.string
      expect(await val('test@test.c')).to.be.string
      expect(await val('test@test.com')).to.be.null
      expect(await val('  test@test.com  ')).to.be.null
      expect(await val(takenEmail)).to.be.string
    })
  
    it('password', () => {
      const validPassword = 'testpassword'
      const val = validatePassword
      expect(() => val(null)).to.throw
      expect(val('')).to.be.string
      expect(val('pass')).to.be.string
      expect(val(validPassword)).to.be.null
    })

    it('name', () => {
      const val = validateName
      expect(() => val(null)).to.throw
      expect(val('   ')).to.be.string
      expect(val('Bob')).to.be.null
      expect(val('A')).to.be.null
      expect(val('')).to.be.null
    })
  })

  describe('form', () => {
    const val = validateSignup
    const validForm = {
      email: 'test@test.com',
      password: 'testpassword',
      name: 'Bob'
    }

    it('invalid form', async () => {
      expect(await val({...validForm, email: ''})).to.have.property('email')
      expect(await val({...validForm, password: ''})).to.have.property('password')
      expect(await val({...validForm, name: '  '})).to.have.property('name')
    })

    it('valid form', async () => {
      expect(await val(validForm)).to.be.empty
    })

    it('trims strings', async () => {
      const untrimmed = '  Joe  '
      const form = Object.assign({}, validForm, {name: untrimmed})
      await val(form)
      expect(form.name).to.equal('Joe')
    })
  })
})