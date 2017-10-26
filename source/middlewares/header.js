module.exports = exports = (req, res, next) => {
  // set headers for JSON REST API
  res.header('Content-Type', 'application/json')

  // set CORS headers
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Methods',
    'GET, PATCH, POST, DELETE, OPTIONS'
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
  )
  return next()
}
