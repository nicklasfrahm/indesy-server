const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const config = require('./config')

const app = express()
const server = http.Server(app)
const io = socketio(server)
const host = config.host || '0.0.0.0'
const port = config.port || 8080

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' })
})

io.on('connection', function(socket) {
  socket.on('sendWifiSignalStrength', data => {
    io.emit('updateWifiSignalStrength', data)
  })
})

app.use((err, req, res, next) => {
  return res.status(500).json({ message: 'An unknown error occured.', err })
})

server.listen(port, host, () => {
  process.stdout.write(`[Server] Listening on ${host}:${port}\n`)
})
