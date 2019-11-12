const mongoose = require('mongoose');

const BinsSchema = new mongoose.Schema({
  coords: {
    address: {
      type: String,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  status: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  mac_address: {
    type: String
  },
  size: {
    type: String,
    enum: ['M', 'G'],
    required: true
  }
});

const Bins = mongoose.model('Bins', BinsSchema);

module.exports = { Bins, BinsSchema };  