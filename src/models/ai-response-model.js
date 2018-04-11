const mongoose = require ('mongoose');

const AIResponseSchema = new mongoose.Schema ({
  topic: {
    type: String,
    required: true,
    unique: true
  },
  options: Array,
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model ('AIResponse', AIResponseSchema);