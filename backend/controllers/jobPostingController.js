const JobPosting = require('../models/JobPosting');
const Candidate = require('../models/Candidate');
const Application = require('../models/Application');
const { sendNotificationEmail } = require('../config/mailer');
const { enrichNaukriJobData, parseNaukriInput, cleanTitleTypos } = require('../utils/naukriEnricher');

const APP_BASE_URL = process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:5173';

// Helper to count potential Resdex matches for a job
async function calculateResdexMatchCount(job) {
  try {
    const orConditions = [];
    if (job.skills && job.skills.length > 0) {
      const skillRegexes = job.skills.map(s => new RegExp((s.name || s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      orConditions.push({ key_skills: { $in: skillRegexes } });
    }
    if (job.title) {
      orConditions.push({ current_role: new RegExp(job.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });
    }
    if (job.locations && job.locations.length > 0) {
      const locRegexes = job.locations.map(l => new RegExp(l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      orConditions.push({ location: { $in: locRegexes } });
    }

    if (orConditions.length === 0) return 0;

    const count = await Candidate.countDocuments({ $or: orConditions });
    return count;
  } catch (err) {
    console.error('Error calculating match count:', err.message);
    return 0;
  }
}

// 1. Create a new Job Posting
exports.createJobPosting = async (req, res) => {
  try {
    const jobData = req.body;

    // Generate reference code if not provided
    if (!jobData.referenceCode) {
      const randomId = Math.floor(1000 + Math.random() * 9000);
      jobData.referenceCode = `MCP-${new Date().getFullYear()}-${randomId}`;
    }

    const newJob = new JobPosting(jobData);
    await newJob.save();

    const matchingCandidatesCount = await calculateResdexMatchCount(newJob);

    // Optional notification to assigned recruiter
    try {
      const recipients = jobData.collaborators && jobData.collaborators.length > 0 
        ? jobData.collaborators.join(', ') 
        : process.env.EMAIL_USER || 'recruiter@mcpconsultants.in';

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #0056b3;">🚀 New Job Posting Published: ${newJob.title}</h2>
          <p><strong>Company:</strong> ${newJob.hideCompany ? 'Confidential Client' : newJob.company}</p>
          <p><strong>Location:</strong> ${(newJob.locations || []).join(', ') || 'Pan India'}</p>
          <p><strong>Experience:</strong> ${newJob.workExperienceMin} to ${newJob.workExperienceMax} Years</p>
          <p><strong>Salary:</strong> ${newJob.salaryMin} to ${newJob.salaryMax} ${newJob.salaryType}</p>
          <p><strong>Reference Code:</strong> ${newJob.referenceCode}</p>
          <p style="margin-top: 20px;">
            <a href="${APP_BASE_URL}/admin/resdex?jobId=${newJob._id}" style="background-color: #0056b3; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Search ${matchingCandidatesCount} Matching Candidates on Resdex
            </a>
          </p>
        </div>
      `;
      await sendNotificationEmail({
        subject: `[New Job Posted] ${newJob.title} - ${newJob.locations ? newJob.locations.join(', ') : ''}`,
        html: emailHtml
      });
    } catch (e) {
      console.warn('Notification email skipped:', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      job: newJob,
      matchingCandidatesCount
    });
  } catch (err) {
    console.error('Error creating job posting:', err);
    res.status(500).json({ success: false, message: 'Server error creating job posting', error: err.message });
  }
};

// 2. Get all Job Postings (with calculated matches)
exports.getJobPostings = async (req, res) => {
  try {
    const { status, search, location } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { department: searchRegex },
        { referenceCode: searchRegex },
        { 'skills.name': searchRegex }
      ];
    }
    if (location && location.trim()) {
      filter.locations = { $in: [new RegExp(location.trim(), 'i')] };
    }

    const jobs = await JobPosting.find(filter).sort({ createdAt: -1 });

    // Attach Resdex match count to each job
    const enrichedJobs = await Promise.all(
      jobs.map(async (job) => {
        const matchCount = await calculateResdexMatchCount(job);
        return {
          ...job.toObject(),
          matchingCandidatesCount: matchCount
        };
      })
    );

    res.json({
      success: true,
      count: enrichedJobs.length,
      jobs: enrichedJobs
    });
  } catch (err) {
    console.error('Error fetching job postings:', err);
    res.status(500).json({ success: false, message: 'Server error fetching job postings' });
  }
};

// 3. Get single Job Posting by ID
exports.getJobPostingById = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    // Increment view count
    job.viewsCount = (job.viewsCount || 0) + 1;
    await job.save();

    const matchingCandidatesCount = await calculateResdexMatchCount(job);

    res.json({
      success: true,
      job: {
        ...job.toObject(),
        matchingCandidatesCount
      }
    });
  } catch (err) {
    console.error('Error fetching single job posting:', err);
    res.status(500).json({ success: false, message: 'Server error fetching job posting' });
  }
};

// 4. Update Job Posting
exports.updateJobPosting = async (req, res) => {
  try {
    const updatedJob = await JobPosting.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    res.json({
      success: true,
      message: 'Job posting updated successfully',
      job: updatedJob
    });
  } catch (err) {
    console.error('Error updating job posting:', err);
    res.status(500).json({ success: false, message: 'Server error updating job posting' });
  }
};

// 5. Delete / Archive Job Posting
exports.deleteJobPosting = async (req, res) => {
  try {
    const job = await JobPosting.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }
    res.json({ success: true, message: 'Job posting removed successfully' });
  } catch (err) {
    console.error('Error deleting job posting:', err);
    res.status(500).json({ success: false, message: 'Server error deleting job posting' });
  }
};

// 6. Candidate Apply to Job
exports.applyToJob = async (req, res) => {
  try {
    const { name, email, phone, currentCtc, expectedCtc, noticePeriod, answers } = req.body;
    const file = req.file || null;
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Candidate name and email are required.' });
    }

    job.applicationsCount = (job.applicationsCount || 0) + 1;
    await job.save();

    const savedCvFilename = file ? (file.savedFilename || file.filename) : null;
    const originalCvName = file ? (file.originalName || file.originalname) : null;

    let parsedAnswers = {};
    if (typeof answers === 'string') {
      try { parsedAnswers = JSON.parse(answers); } catch (e) { parsedAnswers = {}; }
    } else if (answers) {
      parsedAnswers = answers;
    }

    // Persist application safely in MongoDB Atlas
    const application = await Application.create({
      jobId: job._id,
      jobTitle: job.title,
      jobReferenceCode: job.referenceCode || '',
      name,
      email,
      phone: phone || '',
      currentCtc: currentCtc || '',
      expectedCtc: expectedCtc || '',
      noticePeriod: noticePeriod || '',
      answers: parsedAnswers,
      cv_filename: savedCvFilename,
      cv_original_name: originalCvName
    });

    // Prepare email attachments if CV was uploaded
    const emailAttachments = [];
    if (savedCvFilename) {
      const { UPLOADS_DIR } = require('../middleware/upload');
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(UPLOADS_DIR, savedCvFilename);
      if (fs.existsSync(filePath)) {
        emailAttachments.push({
          filename: originalCvName || savedCvFilename,
          path: filePath
        });
      }
    }

    // Notify recruiter via email
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #0056b3;">📥 New Application for: ${job.title}</h2>
          <p><strong>Candidate Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Current CTC:</strong> ${currentCtc || 'Not specified'}</p>
          <p><strong>Expected CTC:</strong> ${expectedCtc || 'Not specified'}</p>
          <p><strong>Notice Period:</strong> ${noticePeriod || 'Not specified'}</p>
          <p><strong>Job Ref:</strong> ${job.referenceCode} (${(job.locations || []).join(', ')})</p>
          <p><strong>Resume:</strong> ${savedCvFilename ? '📎 Attached' : 'No file uploaded'}</p>
          <p style="margin-top: 20px;">
            <a href="${APP_BASE_URL}/admin" style="background-color: #0b1a2f; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Open Admin Portal
            </a>
          </p>
        </div>
      `;
      await sendNotificationEmail({
        subject: `[New Candidate Application] ${name} - ${job.title}`,
        html: emailHtml,
        attachments: emailAttachments
      });
    } catch (e) {
      console.warn('Application notification email error:', e.message);
    }

    res.json({
      success: true,
      applicationId: application._id,
      message: 'Application submitted successfully! Our recruitment team will review your profile.'
    });
  } catch (err) {
    console.error('Error submitting application:', err);
    res.status(500).json({ success: false, message: 'Server error submitting application: ' + err.message });
  }
};

// 7. Seed Initial Sample Job (Disabled - clean production state)
exports.seedSampleJobPostings = async () => {
  // No sample jobs are seeded.
};

// 8. Import / Sync Job from Naukri URL or Job ID (with Rich Executive Domain Enrichment)
exports.importFromNaukri = async (req, res) => {
  try {
    const {
      url,
      jobId,
      autoPublish = false,
      title: customTitle,
      department: customDept,
      locations: customLocations,
      minExp: customMinExp,
      maxExp: customMaxExp
    } = req.body;

    const rawInput = (url || jobId || '').trim();
    if (!rawInput && !customTitle) {
      return res.status(400).json({ success: false, message: 'Please provide a Naukri Job URL, Job ID, or Job Designation.' });
    }

    // Try live HTML fetch if an actual URL was provided
    let fetchedTitle = '';
    if (rawInput.startsWith('http')) {
      try {
        const response = await fetch(rawInput, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        const html = await response.text();
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch && !titleMatch[1].toLowerCase().includes('just a moment') && !titleMatch[1].toLowerCase().includes('job posting website')) {
          fetchedTitle = cleanTitleTypos(titleMatch[1].replace(/-\s*Naukri\.com.*/i, '').trim());
        }
      } catch (fetchErr) {
        console.warn('Direct fetch notice:', fetchErr.message);
      }
    }

    // Comprehensive executive domain enrichment
    const jobData = enrichNaukriJobData({
      rawInput,
      customTitle: (customTitle && customTitle.trim()) || fetchedTitle,
      customDept,
      customLocations,
      customExpMin: customMinExp,
      customExpMax: customMaxExp
    });

    if (autoPublish) {
      // Check if already in DB by referenceCode
      let existing = await JobPosting.findOne({ referenceCode: jobData.referenceCode });
      if (existing) {
        if (customTitle && customTitle.trim()) {
          jobData.title = customTitle.trim();
        }
        Object.assign(existing, jobData);
        await existing.save();
        return res.json({
          success: true,
          message: `Job "${existing.title}" successfully synced and published with complete CTC, skills, and qualifications!`,
          job: existing
        });
      }
      const newJob = new JobPosting(jobData);
      await newJob.save();
      return res.json({
        success: true,
        message: `Job "${newJob.title}" successfully published with complete CTC, skills, and qualifications!`,
        job: newJob
      });
    }

    return res.json({
      success: true,
      message: `Job "${jobData.title}" successfully extracted with full CTC range, skills, education, and JD!`,
      jobData
    });
  } catch (err) {
    console.error('Error importing from Naukri:', err);
    res.status(500).json({ success: false, message: 'Error processing Naukri link: ' + err.message });
  }
};
