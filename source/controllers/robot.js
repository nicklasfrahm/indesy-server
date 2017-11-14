const router = require('express').Router()
const crypto = require('crypto')
const Robot = require('../models/robot')

router.get('/robots', (req, res, next) => {
  Robot.find({}, (err, docs) => {
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
  Robot.create(req.body, (err, doc) => {
    if (err) next(err)
    return res.status(200).json(doc)
  })
})

router.get('/robots/:id', (req, res, next) => {
  Robot.findById(req.params.id, (err, doc) => {
    if (err) next(err)
    return res.status(200).json(doc)
  })
})

router.patch('/robots/:id', (req, res, next) => {
  const tokenRegex = /[a-f0-9]{32}/
  if (!req.body) {
    return res.status(400).json({ error: 'The request body is empty.' })
  }
  if (req.body.token && !tokenRegex.test(req.body.token)) {
    crypto.randomBytes(16, (err, buffer) => {
      req.body.token = buffer.toString('hex')
      Robot.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, doc) => {
        if (err) return next(err)
        return res.status(200).json(doc)
      })
    })
  } else {
    Robot.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, doc) => {
      if (err) return next(err)
      return res.status(200).json(doc)
    })
  }
})

router.delete('/robots/:id', (req, res, next) => {
  Robot.findByIdAndRemove(req.params.id, err => {
    if (err) return next(err)
    return res
      .status(200)
      .json({ message: 'The entity was successfully removed.' })
  })
})

module.exports = exports = router
