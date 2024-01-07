const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  }
}, { _id : false, timestamps: true});

module.exports = friendSchema;