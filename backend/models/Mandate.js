const mongoose = require('mongoose');

const mandateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: { type: String, default: 'Confidential Client' },
  service_type: { type: String, default: 'Workforce Management' },
  sector: { type: String, default: 'Industrial & Corporate' },
  workforce_size: { type: String, default: '50-200 Associates' },
  leadership_level: { type: String, default: 'General Workforce' },
  notes: String,
  doc_filename: String,
  doc_original_name: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mandate', mandateSchema);
