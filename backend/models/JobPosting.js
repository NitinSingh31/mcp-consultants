const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, default: 'MCP Consultants' },
  hideCompany: { type: Boolean, default: false },
  department: { type: String, default: '' },
  employmentType: { type: String, default: 'Full Time, Permanent' },
  workExperienceMin: { type: Number, default: 0 },
  workExperienceMax: { type: Number, default: 0 },
  workMode: { type: String, enum: ['In office', 'Hybrid', 'Remote'], default: 'In office' },
  salaryType: { type: String, enum: ['Total CTC', 'Fixed + variable'], default: 'Total CTC' },
  salaryMin: { type: String, default: '' },
  salaryMax: { type: String, default: '' },
  hideSalary: { type: Boolean, default: false },
  locations: [{ type: String }],
  relocateToLocations: { type: Boolean, default: true },
  vacancies: { type: Number, default: 1 },
  skills: [
    {
      name: { type: String, required: true },
      mandatory: { type: Boolean, default: false }
    }
  ],
  education: [{ type: String }],
  industry: { type: String, default: '' },
  jobDescription: { type: String, default: '' },
  candidateProfile: { type: String, default: '' },
  perks: { type: String, default: '' },
  screeningQuestions: [{ type: String }],
  isWalkIn: { type: Boolean, default: false },
  collaborators: [{ type: String }],
  responseEmailPolicy: { type: String, default: 'As a daily summary' },
  referenceCode: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Draft', 'Closed'], default: 'Active' },
  viewsCount: { type: Number, default: 0 },
  applicationsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobPosting', jobPostingSchema);
