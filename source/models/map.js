const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const MapSchema = new Schema({
  name: { type: String, required: true, unique: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
})

module.exports = exports = mongoose.model('Map', MapSchema)
