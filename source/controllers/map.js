const router = require('express').Router()
const Model = require('../models/map')

router.get('/maps', (req, res, next) => {
  Model.find({}, (err, docs) => {
    if (err) next(err)
    return res.status(200).json(docs)
  })
})

router.post('/maps', (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: 'The request body is empty.' })
  }
  if (!req.body.name) {
    return res.status(400).json({ error: 'The name must not be empty.' })
  }
  if (!(req.body.latitude && req.body.longitude)) {
    return res.status(400).json({
      error: 'Both GPS coordinates, longitude and latitude must not be empty.'
    })
  }
  Model.create(req.body, (err, doc) => {
    if (err) next(err)
    return res.status(200).json(doc)
  })
})

router.get('/maps/:id', (req, res, next) => {
  Model.findById(req.params.id, (err, doc) => {
    if (err) next(err)
    return res.status(200).json(doc)
  })
})

router.patch('/maps/:id', (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: 'The request body is empty.' })
  }
  if (req.body._id && req.body._id !== req.params.id) {
    return res
      .status(400)
      .json({ error: 'Payload ID does not match API path.' })
  }
  Model.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, doc) => {
    if (err) return next(err)
    if (!doc) {
      return res.status(400).json({ error: 'There is no entity with this ID.' })
    }
    return res.status(200).json(doc)
  })
})

router.delete('/maps/:id', (req, res, next) => {
  Model.findByIdAndRemove(req.params.id, err => {
    if (err) return next(err)
    return res
      .status(200)
      .json({ message: 'The entity was successfully removed.' })
  })
})

module.exports = exports = router
