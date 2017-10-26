const winston = require('winston')
const paths = require('../api')

winston.cli()

module.exports = exports = app => {
  // API test route
  app.get('/api/v1/status', (req, res) => {
    return res
      .status(200)
      .json({ message: 'The REST API is online and healthy.', paths })
  })

  // 404 responses
  app.use((req, res, next) => {
    return res
      .status(404)
      .json({ error: 'This API endpoint is not supported.' })
  })

  // 500 responses
  app.use((err, req, res, next) => {
    winston.error(`[API] ${err.message}\n${err.stack}`)
    return res.status(500).json({
      error: 'An unknown error occured.',
      message: err.message,
      stack: err.stack
    })
  })
}
