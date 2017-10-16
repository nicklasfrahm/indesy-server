const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const winston = require('winston')
const config = require('./config')

const app = express()
const server = http.Server(app)
const io = socketio(server, { path: '/ws' })
const host = config.host || '0.0.0.0'
const port = config.port || 8080

let connections = 0
let timer = 0

winston.cli()

io.on('connection', function(connection) {
  const socket = connection

  ++connections
  winston.info('[Server] A websocket client connected.')
  if (connections && !timer) {
    timer = setInterval(() => {
      socket.emit('testTimer', { timestamp: Date.now() })
    }, 1000)
  }

  socket.on('disconnect', () => {
    --connections
    winston.info('[Server] A websocket client disconnected.')
    if (!connections && timer) {
      clearInterval(timer)
      timer = null
    }
  })
})

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

server.listen(port, host, () => {
  winston.info(`[Server] Listening on ${host}:${port}`)
})
