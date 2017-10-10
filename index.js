var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var config = require('./config')

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function(socket) {
  socket.on('sendWifiSignalStrength', data => {
    io.emit('updateWifiSignalStrength', data)
  })
})

http.listen(config.port, function() {
  console.log(`listening on *:${config.port}`)
})
