const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  PORT = process.env.PORT || 5000,
  fs = require('fs-extra'),
  path = require('path'),
  shell = require('shelljs')

const app = express()
app.get('/api/hello', (req, res) => {
  console.log('/api/good')
  res.json({ all: 'good' })
})
app.use(history())
app.use(serveStatic(__dirname + '/dist/spa'))
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})

// extension name should be sn-ext
// extension path?
// shell.exec('npm install ../supanity-test')
// shell.exec()
console.log('process.cwd()', process.cwd())
console.log('__filename', __filename)
console.log('__dirname', __dirname)
console.log('process.pkg.defaultEntrypoint', process.pkg.defaultEntrypoint)
console.log('require.main.filename', require.main.filename)

fs.readdir(__dirname, (err, files) => {
  if (err) { console.log(err) } else {
    console.log('\nCurrent directory filenames:')
    files.forEach(file => {
      console.log(file)
    })
  }
})
const distDir = __dirname + '/dist/spa'
console.log('distDir', distDir)
const distExists = fs.existsSync(distDir)
console.log('distExists', distExists)

const srcDir = path.join(__dirname, 'dist', 'spa')
const destDir = path.join(process.cwd(), '.supanity')
console.log({ srcDir, destDir })
// To copy a folder or file
fs.copySync(distDir, destDir, function (err) {
  if (err) {
    console.error('error!', err)
  } else {
    console.log('success!')
  }
})

// shell.cd(path.join(__dirname))
// shell.cd(distDir)
// shell.cd('..')
// console.log('process.cwd()', process.cwd())
// console.log('__filename', __filename)
// console.log('__dirname', __dirname)
// console.log('process.pkg.defaultEntrypoint', process.pkg.defaultEntrypoint)
// console.log('require.main.filename', require.main.filename)
process.chdir(__dirname)
// process.chdir('C:\snapshot\project')
// shell.exec('npm install ./')
// shell.exec('npm run ext:invoke')
// shell.exec('npm run front:dev')
