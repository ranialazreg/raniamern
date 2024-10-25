const mongoose = require('mongoose');

const adherentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
});

const Adherent = mongoose.model('Adherent', adherentSchema);

module.exports = Adherent;
