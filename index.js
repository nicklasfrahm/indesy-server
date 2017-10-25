const express = require('express')
const socketio = require('socket.io')
const winston = require('winston')
const http = require('http')
const dotenv = require('dotenv')
const loadMiddlewares = require('./source/middlewares')
const loadControllers = require('./source/controllers')
const createGithubHookEmitter = require('./source/hooks/github')

dotenv.config()
winston.cli()

const port = process.env.PORT || 8000
const app = express()
const server = http.Server(app)
const io = socketio(server, { path: '/sio' })
const githubHookEmitter = createGithubHookEmitter({
  path: '/api/v1/hooks/update',
  events: ['push', 'ping'],
  secret: process.env.GITHUB_HOOK_SECRET || ''
})
let connections = 0
let timer = 0

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

app.use(githubHookEmitter)

loadControllers(app)

githubHookEmitter.on('*', (event, repo, payload) => {
  const { ref } = payload
  const requiredRef = 'refs/heads/master'
  const requiredRepo = 'nicklasfrahm/indesy-robot'
  if (event) winston.info(`[GHE] Event: ${event}`)
  if (repo) winston.info(`[GHE] Repo: ${repo}`)
  if (ref) winston.info(`[GHE] Ref: ${ref}`)
  if (repo === requiredRepo && ref === requiredRef) {
    winston.info('[GHE] Triggering update.')
    io.to('robots').emit('update')
  }
})

server.listen(port, () => {
  winston.info(`[API] Listening on 0.0.0.0:${port}`)
  winston.info(`[SIO] Listening on 0.0.0.0:${port}`)
})
