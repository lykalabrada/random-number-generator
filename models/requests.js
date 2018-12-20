const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RequestSchema = new Schema({
  IPAddress: {
    type: String,
    default: null
  },
  allowed: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  random_number: {
    type: Number,
    default: 0
  }
})

module.exports = Requests = mongoose.model('requests', RequestSchema)
