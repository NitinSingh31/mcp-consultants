const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  current_role: { type: String, required: true },
  company: String,
  sector: { type: String, required: true },
  experience: { type: String, required: true },
  location: String,
  key_skills: [String],
  notice_period: String,
  ug_qualification: String,
  pg_qualification: String,
  gender: String,
  annual_ctc: String,
  verified_mobile: { type: Boolean, default: true },
  verified_email: { type: Boolean, default: true },
  linkedin_url: String,
  cv_filename: String,
  cv_original_name: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
