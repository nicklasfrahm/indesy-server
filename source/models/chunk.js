const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const ChunkSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  occupied: Number,
  scanned: Number,
  map: [{ type: ObjectId, ref: 'Map', required: true }]
})

module.exports = exports = mongoose.model('Chunk', ChunkSchema)
