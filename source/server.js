const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const loadMiddlewares = require('./middlewares')
const loadControllers = require('./controllers')
const loadHooks = require('./hooks')
const loadEvents = require('./events')

const app = express()
const server = http.Server(app)
const io = socketio(server, { path: '/sio' })

loadMiddlewares(app)
loadEvents(io)
loadHooks(app, io)
loadControllers(app)

module.exports = exports = server
