const mongoose = require('mongoose');

const mandateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: { type: String, required: true },
  sector: { type: String, required: true },
  leadership_level: { type: String, required: true },
  notes: String,
  doc_filename: String,
  doc_original_name: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mandate', mandateSchema);
