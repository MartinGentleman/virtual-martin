const mongoose = require ('mongoose');

const VisitorSchema = new mongoose.Schema ({
  sessionID: {
    type: String,
    required: true,
    unique: true
  },
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  from: String
});

module.exports = mongoose.model ('Visitor', VisitorSchema);