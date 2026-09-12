const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  topic: { type: String, required: true },
  message: { type: String, required: true },
  cv_filename: String,
  cv_original_name: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
