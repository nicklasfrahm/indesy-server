const winston = require('winston')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const server = require('./source/server')

winston.cli()
dotenv.config()

const port = process.env.PORT || 8000
const databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost/test'

mongoose.Promise = global.Promise
mongoose.connect(databaseUrl, { useMongoClient: true }, err => {
  if (err) {
    winston.error(`[MDB] Connecting failed.`)
    return process.exit(1)
  }
  return winston.info(`[MDB] Connected to ${databaseUrl}`)
})

server.listen(port, () => {
  winston.info(`[API] Listening on 0.0.0.0:${port}`)
  winston.info(`[SIO] Listening on 0.0.0.0:${port}`)
})

process.on('uncaughtException', err => {
  winston.error(`${err.message}\n${err.stack}`)
  return process.exit(1)
})
