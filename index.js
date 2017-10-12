const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const config = require('./config')

const app = express()
const server = http.Server(app)
const io = socketio(server)

app.use(express.static(`${__dirname}/public`))

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

io.on('connection', function(socket) {
  socket.on('sendWifiSignalStrength', data => {
    io.emit('updateWifiSignalStrength', data)
  })
})

app.use((err, req, res, next) => {
  if (!err) return res.sendFile(`${__dirname}/public/index.html`)
  const errorMessage = `An error occured: ${err.message}\n${err.stack}\n`
  process.stdout.write(errorMessage)
  return res.status(500).json({ message: 'An unknown error occured.' })
})

server.listen(config.port, () => {
  process.stdout.write(`Listening on *:${config.port}\n`)
})
