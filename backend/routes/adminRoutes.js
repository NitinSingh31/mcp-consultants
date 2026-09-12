const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

// Public auth routes
router.post('/login', adminController.login);
router.post('/verify-session', adminController.verifySession);
router.post('/forgot-password', adminController.forgotPassword);
router.post('/reset-password', adminController.resetPassword);

// Protected admin routes
router.post('/update-credentials', requireAdmin, adminController.updateCredentials);
router.post('/logout', adminController.logout);
router.get('/submissions', requireAdmin, adminController.getSubmissions);

module.exports = router;
