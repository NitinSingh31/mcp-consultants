const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// Advanced Candidate Search for Resdex
router.post('/search', candidateController.searchCandidates);

// Recent & Saved Searches
router.get('/recent-searches', candidateController.getRecentSearches);

module.exports = router;
