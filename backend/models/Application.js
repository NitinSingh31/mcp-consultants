const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true,
    index: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  jobReferenceCode: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  currentCtc: {
    type: String,
    default: ''
  },
  expectedCtc: {
    type: String,
    default: ''
  },
  noticePeriod: {
    type: String,
    default: ''
  },
  answers: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  cv_filename: {
    type: String,
    default: null
  },
  cv_original_name: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['New', 'Shortlisted', 'Interviewing', 'Selected', 'Rejected'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Application', applicationSchema);
