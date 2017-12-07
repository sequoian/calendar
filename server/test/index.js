require('dotenv').config()
const Mocha = require('mocha'),
  fs = require('fs'),
  path = require('path')

const mocha = new Mocha()

const recursiveReadDir = (dir) => {
  let files = fs.readdirSync(dir).map(file => path.resolve(dir, file))

  files.forEach(file => {
    if (fs.statSync(file).isDirectory()) {
      files = files.concat(recursiveReadDir(file))
    }
  })

  return files
}

const testDir = path.join(__dirname, '..')

recursiveReadDir(testDir).filter(file => {
  // only use files that match *.test.js
  return file.substr(-8) === '.test.js'
}).forEach(file => {
  // add those files for mocha to test
  mocha.addFile(file)
})

mocha.run(failures => {
  process.on('exit', () => {
    process.exit(failures)
  })
})