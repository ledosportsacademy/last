const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    min: 0,
  },
  items: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Donation', donationSchema); 