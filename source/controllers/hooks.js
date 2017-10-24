const { Router } = require('express')
const crypto = require('crypto')
const router = Router()
const githubHookSecret = process.env.GITHUB_HOOK_SECRET

router.post('/hooks/update', (req, res, next) => {
  const event = req.get('x-github-event')
  if (!(event === 'ping' || event === 'push')) {
    return res
      .status(403)
      .json({ message: 'This event is not support by this endpoint.' })
  }
  const signature = req.get('x-hub-signature')
  if (!signature) {
    return res
      .status(403)
      .json({ message: 'This hook requires a valid signature.' })
  }
  const hash = crypto
    .createHash('sha1', githubHookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex')
  if (`sha1=${hash}` !== signature) {
    return res.status(403).json({ message: 'The signature is invalid.', hash })
  } else {
    return res.status(200).json({ message: 'The signature is valid.' })
  }
})

module.exports = exports = router
