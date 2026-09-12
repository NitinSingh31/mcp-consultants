const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { uploadAnySingle } = require('../middleware/upload');

// Database status check
router.get('/db-status', submissionController.getDbStatus);

// Submission endpoints with file upload support
router.post('/hiring', uploadAnySingle, submissionController.postHiring);
router.post('/candidate', uploadAnySingle, submissionController.postCandidate);
router.post('/inquiry', uploadAnySingle, submissionController.postInquiry);

module.exports = router;
