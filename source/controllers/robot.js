const { Router } = require('express')
const Robot = require('../models/robot')
const router = Router()

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
    return res.status(400).json({ error: 'The name is required.' })
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
  if (!req.body) {
    return res.status(400).json({ error: 'The request body is empty.' })
  }
  Robot.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, doc) => {
    if (err) return next(err)
    return res.status(200).json(doc)
  })
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
