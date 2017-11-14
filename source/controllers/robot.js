const router = require('express').Router()
const crypto = require('crypto')
const Model = require('../models/robot')

router.get('/robots', (req, res, next) => {
  Model.find({}, (err, docs) => {
    if (err) next(err)
    return res.status(200).json(docs)
  })
})

router.post('/robots', (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: 'The request body is empty.' })
  }
  if (!req.body.name) {
    return res.status(400).json({ error: 'The name must not be empty.' })
  }
  Model.create(req.body, (err, doc) => {
    if (err) next(err)
    return res.status(200).json(doc)
  })
})

router.get('/robots/:id', (req, res, next) => {
  Model.findById(req.params.id, (err, doc) => {
    if (err) next(err)
    return res.status(200).json(doc)
  })
})

router.patch('/robots/:id', (req, res, next) => {
  const tokenRegex = /[a-f0-9]{32}/
  if (!req.body) {
    return res.status(400).json({ error: 'The request body is empty.' })
  }
  if (req.body._id && req.body._id !== req.params.id) {
    return res
      .status(400)
      .json({ error: 'Payload ID does not match API path.' })
  }
  if (req.body.token && !tokenRegex.test(req.body.token)) {
    crypto.randomBytes(16, (err, buffer) => {
      req.body.token = buffer.toString('hex')
      Model.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, doc) => {
        if (err) return next(err)
        if (!doc) {
          return res
            .status(400)
            .json({ error: 'There is no entity with this ID.' })
        }
        return res.status(200).json(doc)
      })
    })
  } else {
    Model.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, doc) => {
      if (err) return next(err)
      if (!doc) {
        return res
          .status(400)
          .json({ error: 'There is no entity with this ID.' })
      }
      return res.status(200).json(doc)
    })
  }
})

router.delete('/robots/:id', (req, res, next) => {
  Model.findByIdAndRemove(req.params.id, err => {
    if (err) return next(err)
    return res
      .status(200)
      .json({ message: 'The entity was successfully removed.' })
  })
})

module.exports = exports = router
