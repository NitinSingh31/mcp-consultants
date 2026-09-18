const mongoose = require('mongoose');

const mandateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: { type: String, default: 'Confidential Client' },
  sector: { type: String, default: 'Executive Search & Leadership' },
  leadership_level: { type: String, default: 'Senior Leadership' },
  notes: String,
  doc_filename: String,
  doc_original_name: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mandate', mandateSchema);
