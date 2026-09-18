const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  first_name: String,
  last_name: String,
  email: { type: String, required: true },
  phone: String,
  gender: String,
  dob: String,
  city: String,
  location: String,
  company: String,
  designation: String,
  current_role: { type: String, default: 'Executive Leadership' },
  sector: { type: String, default: 'Heavy Engineering & Industrial' },
  experience: { type: String, default: '10+ Years' },
  annual_ctc: String,
  degree: String,
  institute: String,
  function_area: String,
  key_skills: [String],
  notice_period: String,
  ug_qualification: String,
  pg_qualification: String,
  verified_mobile: { type: Boolean, default: true },
  verified_email: { type: Boolean, default: true },
  linkedin_url: String,
  cv_filename: String,
  cv_original_name: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
