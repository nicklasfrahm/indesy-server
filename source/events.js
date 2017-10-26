const winston = require('winston')

winston.cli()

let connections = 0
let timer = null

module.exports = exports = io => {
  io.on('connection', function(connection) {
    const socket = connection
    const rooms = ['robots']

    // increment connections and create timer if necessary
    ++connections
    winston.info('[SIO] A websocket client connected.')
    if (connections && !timer) {
      winston.info('[SIO] Creating timer!')
      timer = setInterval(() => {
        io.emit('testTimer', { timestamp: Date.now() })
      }, 1000)
    }

    // decrement connections and delete timer if necessary
    socket.on('disconnect', () => {
      --connections
      winston.info('[SIO] A websocket client disconnected.')
      if (!connections && timer) {
        winston.info('[SIO] Deleting timer!')
        clearInterval(timer)
        timer = null
      }
    })

    // permit clients to join rooms if they exist
    socket.on('join', data => {
      if (rooms.includes(data.room)) socket.join(data.room)
    })
  })
}
