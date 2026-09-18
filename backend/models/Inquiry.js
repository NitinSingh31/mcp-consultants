const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: String,
  source: String,
  topic: { type: String, default: 'General Query' },
  message: { type: String, default: '' },
  cv_filename: String,
  cv_original_name: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
