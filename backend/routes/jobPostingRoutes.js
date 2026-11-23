const express = require('express');
const router = express.Router();
const jobPostingController = require('../controllers/jobPostingController');

const { requireAdmin } = require('../middleware/auth');
const { uploadAnySingle } = require('../middleware/upload');

// Standard Job Posting CRUD
router.post('/', requireAdmin, jobPostingController.createJobPosting);
router.get('/', jobPostingController.getJobPostings);
router.get('/:id', jobPostingController.getJobPostingById);
router.put('/:id', requireAdmin, jobPostingController.updateJobPosting);
router.delete('/:id', requireAdmin, jobPostingController.deleteJobPosting);

// Naukri Sync / Import Route (Protected)
router.post('/import-naukri', requireAdmin, jobPostingController.importFromNaukri);

// Public Candidate Apply Route (Supports optional CV upload)
router.post('/:id/apply', uploadAnySingle, jobPostingController.applyToJob);

module.exports = router;
