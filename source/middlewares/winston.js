const winston = require('winston')

winston.cli()

// add morgan-like logger
module.exports = exports = (req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const delta = Date.now() - start
    const { statusCode } = res
    const { method } = req
    const baseUrl = req.baseUrl || ''
    const url = req.url || ''
    winston.info(`[API] ${statusCode} ${method} ${baseUrl}${url} ${delta}ms`)
  })
  return next()
}
