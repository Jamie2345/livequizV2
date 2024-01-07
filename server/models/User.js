const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pendingSchema = require('./Pending');
const friendSchema = require('./Friend');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pfp: {
    type: String,
    default: '/images/pfps/user.png'
  },
  flag: {
    type: String
  },
  saved_quizzes: {
    type: Array,
  },
  xp: {
    type: Number,
    default: 0
  },
  friends: {
    type: [friendSchema],
  },
  pendingFriends: {
    type: pendingSchema,
  }

}, {timestamps: true})

const User = mongoose.model('User', userSchema)
module.exports = User