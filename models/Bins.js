const mongoose = require('mongoose');

const place = { type: mongoose.Schema.Types.ObjectId, ref: 'Places' };

const BinsSchema = new mongoose.Schema({
  place,
  storage_level: {
    type: Number,
    default: 0.0
  },
  gathering_status: {
    type: String,
    enum: [
      'GATHERING_SCHEDULED'
    ],
    default: 'GATHERING_SCHEDULED'
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