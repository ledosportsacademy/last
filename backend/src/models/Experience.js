const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Experience', experienceSchema); 