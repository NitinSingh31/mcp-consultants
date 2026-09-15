const express = require('express');
const router = express.Router();
const jobPostingController = require('../controllers/jobPostingController');

// Standard Job Posting CRUD
router.post('/', jobPostingController.createJobPosting);
router.get('/', jobPostingController.getJobPostings);
router.get('/:id', jobPostingController.getJobPostingById);
router.put('/:id', jobPostingController.updateJobPosting);
router.delete('/:id', jobPostingController.deleteJobPosting);

// Public Candidate Apply Route
router.post('/:id/apply', jobPostingController.applyToJob);

module.exports = router;
