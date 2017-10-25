module.exports = exports = app => {
  app.get('/api/v1/hello-world', (req, res) => {
    return res.status(200).json({ message: 'Hello World!' })
  })

  app.use((req, res, next) => {
    req.winston.error(`[API] Unsupported endpoint: ${req.baseUrl}${req.url}`)
    return res
      .status(404)
      .json({ message: 'This API endpoint is not supported.' })
  })

  app.use((err, req, res, next) => {
    req.winston.error(`[API] ${err.message}\n${err.stack}`)
    return res.status(500).json({
      message: 'An unknown error occured.',
      error: { stack: err.stack, message: err.message }
    })
  })

  return app
}
