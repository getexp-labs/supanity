const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  PORT = process.env.PORT || 5000,
  fs = require('fs-extra'),
  path = require('path'),
  shell = require('shelljs')

const app = express()

// shell.exec('npm install ../supanity-test')
// shell.exec('quasar ext invoke sn-ext')
// shell.exec('npm run front:dev')

app.get('/api/hello', (req, res) => {
  console.log('/api/good')
  res.json({ all: 'good' })
})
app.use(history())
app.use(serveStatic(__dirname + '/dist/spa'))
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})

// process.env.supanity = 'production'
// fs.readdir(process.cwd(), (err, files) => {
//   if (err) { console.log(err) } else {
//     console.log('\nCurrent directory filenames:')
//     files.forEach(file => {
//       console.log(file)
//     })
//   }
// })
