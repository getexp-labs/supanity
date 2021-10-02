const express = require('express')
const serveStatic = require('serve-static')
const history = require('connect-history-api-fallback')
const PORT = process.env.PORT || 3000
const path = require('path')

console.log('__dirname', __dirname)

const app = express()

// const normalizedPath = path.join(__dirname, 'api')
// fs.readdirSync(normalizedPath).forEach(function (file) {
//   const [routePath, fileExtension] = file.split('.')
//   if (fileExtension === 'js') app.use(`/api/${routePath}`, require(`./api/${file}`))
// })

app.use(history())
app.use(serveStatic(path.join(__dirname, '..', 'dist')))

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
