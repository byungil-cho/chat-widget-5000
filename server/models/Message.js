const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  nickname: String,
  content: String,
  type: { type: String, default: 'user' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
