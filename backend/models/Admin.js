const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true },
  resetOtp: String,
  resetOtpExpires: Date,
  sessionToken: String,
  sessionTokenExpires: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);
