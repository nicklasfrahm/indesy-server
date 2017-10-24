const express = require('express')
const socketio = require('socket.io')
const winston = require('winston')
const http = require('http')
const loadMiddlewares = require('./source/middlewares')
const loadControllers = require('./source/controllers')

const port = process.env.PORT || 8000
const app = express()
const server = http.Server(app)
const io = socketio(server, { path: '/sio' })
let connections = 0
let timer = 0

winston.cli()

// websocket server
io.on('connection', function(connection) {
  const socket = connection

  ++connections
  winston.info('[SIO] A websocket client connected.')
  if (connections && !timer) {
    winston.info('[SIO] Creating timer!')
    timer = setInterval(() => {
      io.emit('testTimer', { timestamp: Date.now() })
    }, 1000)
  }

  socket.on('disconnect', () => {
    --connections
    winston.info('[SIO] A websocket client disconnected.')
    if (!connections && timer) {
      winston.info('[SIO] Deleting timer!')
      clearInterval(timer)
      timer = null
    }
  })
})

// express server
loadMiddlewares(app)
loadControllers(app)

server.listen(port, () => {
  winston.info(`[API] Listening on 0.0.0.0:${port}`)
  winston.info(`[SIO] Listening on 0.0.0.0:${port}`)
})
