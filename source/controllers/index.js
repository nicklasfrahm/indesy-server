const hookRouter = require('./hooks')

module.exports = exports = app => {
  app.use('/api/v1', hookRouter)

  app.get('/api/v1/hello-world', (req, res) => {
    return res.status(200).json({ message: 'Hello World!' })
  })

  app.use((req, res, next) => {
    req.winston.error(`[API] Unsupported request to: ${req.baseUrl}${req.url}`)
    return res
      .status(404)
      .json({ message: 'This API endpoint is not supported.' })
  })

  app.use((err, req, res, next) => {
    req.winston.error(`[API] ${err.message}\n${err.stack}`)
    return res
      .status(500)
      .json({
        message: 'An unknown error occured.',
        error: { stack: err.stack, message: err.message }
      })
  })

  return app
}
