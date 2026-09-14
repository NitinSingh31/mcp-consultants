const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// Advanced Candidate Search for Resdex
router.post('/search', candidateController.searchCandidates);

// Recent & Saved Searches
router.get('/recent-searches', candidateController.getRecentSearches);
router.delete('/recent-searches', candidateController.clearRecentSearches);
router.post('/clear-recent-searches', candidateController.clearRecentSearches);
router.delete('/saved-searches', candidateController.clearSavedSearches);
router.post('/clear-saved-searches', candidateController.clearSavedSearches);

module.exports = router;
