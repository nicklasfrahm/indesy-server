const winston = require('winston').cli()

module.exports = exports = (req, res, next) => {
  req.winston = winston
  return next()
}
