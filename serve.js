const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  PORT = process.env.PORT || 3000

const app = express()

// app.get('/api/hello', (req, res) => {
//   console.log('/api/good')
//   res.json({ all: 'good' })
// })

app.use(history())
app.use(serveStatic(__dirname + '/dist/spa'))
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
