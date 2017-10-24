const bodyParser = require('body-parser')
const winstonMiddleware = require('./winston')

module.exports = exports = app => {
  app.disable('x-powered-by')
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(winstonMiddleware)

  return app
}
