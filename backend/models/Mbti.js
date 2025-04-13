const mongoose = require('mongoose');

const mbtiSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional, as users might take the test before registering
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Not specified']
  },
  result: {
    type: String,
    required: true
  },
  scores: {
    O: Number,
    C: Number,
    E: Number,
    A: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Mbti = mongoose.model('Mbti', mbtiSchema);

module.exports = Mbti;
