const bodyParser = require('body-parser')
const winstonMiddleware = require('./winston')
const headerMiddleware = require('./header')

module.exports = exports = app => {
  // secure API by reducing attack surface
  app.disable('x-powered-by')

  // load morgan-like winston middleware
  app.use(winstonMiddleware)

  // apply appropiate headers
  app.use(headerMiddleware)

  // load and config body-parser
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
}
