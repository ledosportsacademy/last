const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  hasPaidWeeklyFee: {
    type: Boolean,
    default: false,
  },
  lastPaymentDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Member', memberSchema); 