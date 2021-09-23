const express = require('express')
const serveStatic = require('serve-static')
const history = require('connect-history-api-fallback')
const PORT = process.env.PORT || 3000
const path = require('path')

const app = express()

app.get('/api/hello', (req, res) => {
  console.log('/api/good')
  res.json({ all: 'good' })
})

app.use(history())
console.log('__dirname', __dirname)
app.use(serveStatic(path.join(__dirname, '..', 'dist')))
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
