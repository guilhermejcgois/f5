const mongoose = require('mongoose');

const BinSchema = new mongoose.Schema({
  coords: {
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
  }
}, {
  collection: "raspberry_records"
});

const Bin = mongoose.model('Bin', BinSchema);

module.exports = { Bin, BinSchema };  