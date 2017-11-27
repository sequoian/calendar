const express = require('express')
const path = require('path')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 5000

// Priority serve any static files.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../react/build')))
}

// Routes
app.use('/', routes)
app.get('/', (req, res) => {
  res.send('hi')
})

// All remaining requests return the React app, so it can handle routing.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../react/build', 'index.html'))
})

// Listen for incoming requests
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})