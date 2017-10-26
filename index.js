const winston = require('winston')
const dotenv = require('dotenv')
const server = require('./source/server')

winston.cli()
dotenv.config()

const port = process.env.PORT || 8000

server.listen(port, () => {
  winston.info(`[API] Listening on 0.0.0.0:${port}`)
  winston.info(`[SIO] Listening on 0.0.0.0:${port}`)
})

process.on('uncaughtException', err => {
  return winston.error(`${err.message}\n${err.stack}`)
  process.exit(1)
})
