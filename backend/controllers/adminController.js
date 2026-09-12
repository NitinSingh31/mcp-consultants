const crypto = require('crypto');
const AdminModel = require('../models/Admin');
const MandateModel = require('../models/Mandate');
const CandidateModel = require('../models/Candidate');
const InquiryModel = require('../models/Inquiry');
const { hashPassword, verifyPassword } = require('../utils/crypto');
const { sendNotificationEmail, NOTIFICATION_EMAILS } = require('../config/mailer');
const { getAuthenticatedAdmin } = require('../middleware/auth');

// POST /api/admin/login
exports.login = async (req, res) => {
  try {
    const body = req.body || {};
    const identifier = (body.username || body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'Username/Email and Password are required.' });
    }

    // Match username or email
    const admin = await AdminModel.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${identifier}$`, 'i') } },
        { email: { $regex: new RegExp(`^${identifier}$`, 'i') } }
      ]
    });

    if (!admin || !verifyPassword(password, admin.passwordHash, admin.salt)) {
      return res.status(401).json({ success: false, error: 'Invalid credentials. Please verify your username and password.' });
    }

    // Generate 7-day session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    admin.sessionToken = sessionToken;
    admin.sessionTokenExpires = sessionExpires;
    await admin.save();

    res.status(200).json({
      success: true,
      token: sessionToken,
      username: admin.username,
      email: admin.email,
      message: 'Authentication successful.'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/admin/verify-session
exports.verifySession = async (req, res) => {
  try {
    const body = req.body || {};
    const token = body.token || '';

    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided.' });
    }

    const admin = await AdminModel.findOne({
      sessionToken: token,
      sessionTokenExpires: { $gt: new Date() }
    });

    if (!admin) {
      return res.status(401).json({ success: false, error: 'Session expired. Please log in again.' });
    }

    res.status(200).json({
      success: true,
      username: admin.username,
      email: admin.email
    });
  } catch (err) {
    console.error('Verify session error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/admin/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const body = req.body || {};
    const email = (body.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }

    // Check against admin record or authorized emails
    let admin = await AdminModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!admin) {
      const authEmails = NOTIFICATION_EMAILS.toLowerCase();
      if (authEmails.includes(email)) {
        admin = await AdminModel.findOne();
      }
    }

    if (!admin) {
      return res.status(404).json({ success: false, error: 'No admin account found for that email.' });
    }

    // Generate 6-digit OTP (valid for 10 minutes)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    admin.resetOtp = otp;
    admin.resetOtpExpires = otpExpires;
    await admin.save();

    // Dispatch reset email
    sendNotificationEmail({
      subject: `🔑 [MCP CONSULTANTS] Admin Password Reset Code: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px; color: #0b1a2f;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background: #0b1a2f; padding: 20px 24px; border-bottom: 3px solid #c49a45;">
              <h2 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 0.5px;">MCP CONSULTANTS</h2>
              <p style="color: #c49a45; margin: 4px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Admin Security Service</p>
            </div>
            <div style="padding: 24px; text-align: center;">
              <p style="font-size: 15px; margin-top: 0; color: #475569;">You requested a password reset for your Executive Practice Portal account.</p>
              <p style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Your 6-digit verification code is:</p>
              <div style="background: #f1f5f9; border: 2px dashed #c49a45; padding: 14px 20px; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0b1a2f; display: inline-block; margin: 12px auto; border-radius: 8px;">
                ${otp}
              </div>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 14px;">This code will expire in <strong>10 minutes</strong>. If you did not request this, you may safely ignore this email.</p>
            </div>
          </div>
        </div>
      `
    });

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${email}. Check your inbox or spam folder.`
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/admin/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const body = req.body || {};
    const email = (body.email || '').trim().toLowerCase();
    const otp = (body.otp || '').trim();
    const newPassword = body.newPassword || '';

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, 6-digit OTP code, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
    }

    let admin = await AdminModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      resetOtp: otp,
      resetOtpExpires: { $gt: new Date() }
    });

    if (!admin) {
      const authEmails = NOTIFICATION_EMAILS.toLowerCase();
      if (authEmails.includes(email)) {
        admin = await AdminModel.findOne({
          resetOtp: otp,
          resetOtpExpires: { $gt: new Date() }
        });
      }
    }

    if (!admin) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP code. Please request a new code.' });
    }

    // Update password hash
    const salt = crypto.randomBytes(16).toString('hex');
    admin.salt = salt;
    admin.passwordHash = hashPassword(newPassword, salt);
    admin.resetOtp = null;
    admin.resetOtpExpires = null;

    // Issue new session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    admin.sessionToken = sessionToken;
    admin.sessionTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    admin.updatedAt = new Date();
    await admin.save();

    res.status(200).json({
      success: true,
      token: sessionToken,
      username: admin.username,
      email: admin.email,
      message: 'Password successfully reset! You are now logged in.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/admin/update-credentials
exports.updateCredentials = async (req, res) => {
  try {
    const admin = req.admin || await getAuthenticatedAdmin(req);
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Please log in first.' });
    }

    const body = req.body || {};
    const currentPassword = body.currentPassword || '';
    const newUsername = (body.newUsername || '').trim();
    const newEmail = (body.newEmail || '').trim().toLowerCase();
    const newPassword = body.newPassword || '';

    if (!verifyPassword(currentPassword, admin.passwordHash, admin.salt)) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect. Authorization denied.' });
    }

    if (newUsername && newUsername !== admin.username) {
      const conflict = await AdminModel.findOne({ username: newUsername, _id: { $ne: admin._id } });
      if (conflict) {
        return res.status(400).json({ success: false, error: 'This username is already taken by another admin.' });
      }
      admin.username = newUsername;
    }

    if (newEmail) {
      admin.email = newEmail;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
      }
      const salt = crypto.randomBytes(16).toString('hex');
      admin.salt = salt;
      admin.passwordHash = hashPassword(newPassword, salt);
    }

    admin.updatedAt = new Date();
    await admin.save();

    res.status(200).json({
      success: true,
      username: admin.username,
      email: admin.email,
      message: 'Account credentials updated successfully in MongoDB!'
    });
  } catch (err) {
    console.error('Update credentials error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/admin/logout
exports.logout = async (req, res) => {
  try {
    const admin = req.admin || await getAuthenticatedAdmin(req);
    if (admin) {
      admin.sessionToken = null;
      admin.sessionTokenExpires = null;
      await admin.save();
    }
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/admin/submissions
exports.getSubmissions = async (req, res) => {
  try {
    const authAdmin = req.admin || await getAuthenticatedAdmin(req);
    if (!authAdmin) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Please sign in to access the executive practice portal.' });
    }

    const mList = await MandateModel.find().sort({ createdAt: -1 }).lean();
    const cList = await CandidateModel.find().sort({ createdAt: -1 }).lean();
    const iList = await InquiryModel.find().sort({ createdAt: -1 }).lean();

    // Format MongoDB documents with id and created_at
    const mandates = mList.map(m => ({ ...m, id: m._id.toString().slice(-6), created_at: m.createdAt }));
    const candidates = cList.map(c => ({ ...c, id: c._id.toString().slice(-6), created_at: c.createdAt }));
    const inquiries = iList.map(i => ({ ...i, id: i._id.toString().slice(-6), created_at: i.createdAt }));

    res.status(200).json({
      activeDatabase: 'MongoDB Atlas',
      authenticatedUser: {
        username: authAdmin.username,
        email: authAdmin.email
      },
      stats: {
        mandatesCount: mandates.length,
        candidatesCount: candidates.length,
        inquiriesCount: inquiries.length
      },
      mandates,
      candidates,
      inquiries
    });
  } catch (err) {
    console.error('Error fetching admin data:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
