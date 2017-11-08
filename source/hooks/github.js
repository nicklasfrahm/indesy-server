const EventEmitter = require('events').EventEmitter
const crypto = require('crypto')

module.exports = exports = function(options) {
  // verify options
  if (typeof options !== 'object') {
    throw new TypeError('Options: options must be of type object.')
  }
  if (typeof options.path !== 'string') {
    throw new TypeError('Options: path must be of type string.')
  }
  if (!Array.isArray(options.events)) {
    throw new TypeError('Options: events must be of type array.')
  }
  if (!options.events.length) {
    throw new TypeError('Options: events must not be empty.')
  }

  // set default values for options
  options.secret = options.secret || ''
  options.uniqueRepo =
    typeof options.uniqueRepo === 'undefined' ? true : options.uniqueRepo

  function githubHookHandler(req, res, next) {
    function reject(code, error) {
      githubHookHandler.emit('error', new Error(error), req, res)
      return res.status(code).json({ error })
    }

    // verify method and URL
    if (req.method !== 'POST' || req.url.split('?').shift() !== options.path) {
      return next()
    }

    // verify delivery header
    const delivery = req.get('x-github-delivery')
    if (!delivery) {
      return reject(400, 'This endpoint requires a valid delivery ID.')
    }

    // verify event header
    const event = req.get('x-github-event')
    if (!event) {
      return reject(400, 'This endpoint requires a valid event.')
    }
    if (!options.events.includes(event)) {
      return reject(400, 'This endpoint does not support this event.')
    }

    // verify signature header
    const signature = req.get('x-hub-signature')
    if (!signature) {
      return reject(400, 'This hook requires a valid signature.')
    }
    if (options.signature) {
      const hash = crypto
        .createHmac('sha1', options.secret)
        .update(JSON.stringify(req.body))
        .digest('hex')
      if (`sha1=${hash}` !== signature) {
        return reject(401, 'The signatures could not be verified.')
      }
    }

    // verify body content
    if (!req.body) {
      return reject(400, 'The endpoint did not receive any payload.')
    }

    // parse payload
    const payload = req.body
    const repo =
      payload.repository && !options.uniqueRepo
        ? payload.repository.name
        : payload.repository.full_name

    // emit events
    githubHookHandler.emit('*', event, repo, payload)
    githubHookHandler.emit(event, repo, payload)
    if (repo) githubHookHandler.emit(repo, event, payload)

    // send response
    return res.status(200).json({
      message: 'The hook has successfully been triggered.',
      delivery,
      event,
      signature,
      repo
    })
  }

  // inherit event emitter properties
  Object.assign(githubHookHandler, EventEmitter.prototype)
  EventEmitter.call(githubHookHandler)

  return githubHookHandler
}
