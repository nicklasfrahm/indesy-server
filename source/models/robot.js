const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const RobotSchema = new Schema({
  name: { type: String, required: true, unique: true },
  xPos: { type: Number, required: true, default: 0 },
  yPos: { type: Number, required: true, default: 0 },
  angle: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    required: true,
    enum: ['Online', 'Offline'],
    default: 'Offline'
  },
  token: {
    type: String,
    required: true,
    default: crypto.randomBytes(16).toString('hex')
  },
  map: { type: ObjectId, ref: 'Map' }
})

module.exports = exports = mongoose.model('Robot', RobotSchema)
