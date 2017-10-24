const { Router } = require('express')
const router = Router()

router.post('/hooks/update', (req, res, next) => {
  const client = req.get('x-forwarded-for') || req.connection.remoteAddress
  const event = req.get('x-github-event')
  if (!(event === 'ping' || event === 'push')) {
    return res
      .status(403)
      .json({ message: 'This event is not support by this endpoint.' })
  }
  if (!client) {
    return res.status(403).json({ message: 'Client IP must be visible.' })
  } else {
    return res.status(200).json({ message: 'Client IP is visible.', client })
  }
})

module.exports = exports = router
