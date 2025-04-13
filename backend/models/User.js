const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  mbtiResults: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mbti'
  }],
  currentMbtiType: {
    type: String,
    enum: [
      'INTJ', 'INTP', 'ENTJ', 'ENTP',
      'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
      'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ]
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;