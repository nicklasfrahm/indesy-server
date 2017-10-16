const express = require('express')
const socketio = require('socket.io')
const winston = require('winston')
const config = require('./config')

const app = express()
const io = socketio({
  path: '/ws',
  origins: '*'
})

let connections = 0
let timer = 0

winston.cli()
winston.info(`[SIO] Listening on 0.0.0.0:${config.wsPort}`)

// websocket server
io.on('connection', function(connection) {
  const socket = connection

  ++connections
  winston.info('[SIO] A websocket client connected.')
  if (connections && !timer) {
    timer = setInterval(() => {
      socket.emit('testTimer', { timestamp: Date.now() })
    }, 1000)
  }

  socket.on('disconnect', () => {
    --connections
    winston.info('[SIO] A websocket client disconnected.')
    if (!connections && timer) {
      clearInterval(timer)
      timer = null
    }
  })
})

io.listen(config.wsPort)

// express server
app.get('/api/v1/hello-world', (req, res) => {
  return res.status(200).json({ message: 'Hello World!' })
})

app.use((req, res, next) => {
  return res
    .status(404)
    .jsonp({ message: 'This API endpoint is not supported.' })
})

app.use((err, req, res, next) => {
  return res.status(500).json({ message: 'An unknown error occured.' })
})

app.listen(config.apiPort, () => {
  winston.info(`[API] Listening on 0.0.0.0:${config.apiPort}`)
})
