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

  options.secret = options.secret || ''
  options.uniqueRepo =
    typeof options.uniqueRepo === 'undefined' ? true : options.uniqueRepo

  function githubHookHandler(req, res, next) {
    function reject(message) {
      githubHookHandler.emit('error', new Error(message), req, res)
      return res.status(403).json({ message })
    }

    // verify method and URL
    if (req.method !== 'POST' || req.url.split('?').shift() !== options.path) {
      return next()
    }

    // verify delivery header
    const delivery = req.get('x-github-delivery')
    if (!delivery) {
      return reject('This endpoint requires a valid delivery ID.')
    }

    // verify event header
    const event = req.get('x-github-event')
    if (!event) {
      return reject('This endpoint requires a valid event.')
    }
    if (!options.events.includes(event)) {
      return reject('This endpoint does not support this event.')
    }

    // verify signature header
    const signature = req.get('x-hub-signature')
    if (!signature) {
      return reject('This hook requires a valid signature.')
    }
    if (options.signature) {
      const hash = crypto
        .createHmac('sha1', options.secret)
        .update(JSON.stringify(req.body))
        .digest('hex')
      if (`sha1=${hash}` !== signature) {
        return reject('The signatures could not be verified.')
      }
    }

    // verify body content
    if (!req.body) {
      return reject('The endpoint did not receive any payload.')
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

  Object.assign(githubHookHandler, EventEmitter.prototype)
  EventEmitter.call(githubHookHandler)

  return githubHookHandler
}
