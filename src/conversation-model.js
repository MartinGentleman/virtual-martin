const mongoose = require ('mongoose');

const ConversationSchema = new mongoose.Schema ({
  sessionID: {
    type: String,
    required: true
  },
  query: String,
  response: String,
  intent: String,
  parameters: Array,
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model ('Conversation', ConversationSchema);