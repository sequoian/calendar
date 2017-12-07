before(() => {
  process.env.NODE_ENV = 'test'
})

after(() => {
  process.env.NODE_ENV = 'development'
})