const path = require('path');
const fs = require('fs');
const MandateModel = require('../models/Mandate');
const CandidateModel = require('../models/Candidate');
const InquiryModel = require('../models/Inquiry');
const { getIsMongoConnected } = require('../config/db');
const { mailTransporter, escapeHtml, sendNotificationEmail } = require('../config/mailer');
const { UPLOADS_DIR } = require('../middleware/upload');

const PORT = process.env.PORT || 3000;

// GET /api/db-status
exports.getDbStatus = (req, res) => {
  res.json({
    database: 'MongoDB Atlas',
    connected: getIsMongoConnected(),
    emailAlertsActive: !!mailTransporter
  });
};

// POST /api/hiring
exports.postHiring = async (req, res) => {
  try {
    const data = req.body || {};
    const file = req.file || null;

    const savedDocFilename = file ? (file.savedFilename || file.filename) : null;
    const originalDocName = file ? (file.originalName || file.originalname) : null;

    await MandateModel.create({
      name: data.name || 'Anonymous',
      email: data.email || '',
      phone: data.phone || '',
      company: data.company || 'Confidential Client',
      sector: data.sector || 'Executive Search & Leadership',
      leadership_level: data.leadership_level || 'Senior Leadership Mandate',
      notes: data.notes || data.message || '',
      doc_filename: savedDocFilename,
      doc_original_name: originalDocName
    });

    // Prepare email attachments if JD/spec was uploaded
    const emailAttachments = [];
    if (savedDocFilename) {
      const filePath = path.join(UPLOADS_DIR, savedDocFilename);
      if (fs.existsSync(filePath)) {
        emailAttachments.push({
          filename: originalDocName || savedDocFilename,
          path: filePath
        });
      }
    }

    // Trigger instant email alert to the recruitment team
    sendNotificationEmail({
      subject: `🚨 [New Mandate] ${data.leadership_level || 'Leadership'} Search - ${data.company || 'Enterprise Client'}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px; color: #0b1a2f;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background: #0b1a2f; padding: 20px 24px; border-bottom: 3px solid #c49a45;">
              <h2 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 0.5px;">MCP CONSULTANTS</h2>
              <p style="color: #c49a45; margin: 4px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">New Leadership Search Mandate</p>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 16px; margin-top: 0;">A client has submitted a new executive hiring mandate via the website:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 140px;"><strong>Client Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${escapeHtml(data.name)}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Company:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${escapeHtml(data.company)}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Work Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #0b1a2f;">${escapeHtml(data.email)}</a></td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${escapeHtml(data.phone)}" style="color: #0b1a2f;">${escapeHtml(data.phone || 'N/A')}</a></td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Industry Sector:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.sector)}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Role Level:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #c49a45; font-weight: bold;">${escapeHtml(data.leadership_level)}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Notes:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.notes || 'None')}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Attached Document:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #16a34a; font-weight: bold;">${savedDocFilename ? '📎 ' + escapeHtml(originalDocName || savedDocFilename) + ' (Attached to this email)' : 'No file attached'}</td></tr>
              </table>
              <div style="margin-top: 24px; text-align: center;">
                <a href="http://localhost:${PORT}/admin" style="background: #0b1a2f; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Open Admin Dashboard &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      `,
      attachments: emailAttachments
    });

    res.status(200).json({
      success: true,
      database: 'MongoDB Atlas',
      message: 'Mandate inquiry recorded successfully.'
    });
  } catch (err) {
    console.error('Error recording mandate:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/candidate
exports.postCandidate = async (req, res) => {
  try {
    const fields = req.body || {};
    const file = req.file || null;

    const savedCvFilename = file ? (file.savedFilename || file.filename) : null;
    const originalCvName = file ? (file.originalName || file.originalname) : null;

    const fullName = fields.name || `${fields.firstName || ''} ${fields.lastName || ''}`.trim() || 'Anonymous Candidate';
    const skillsArray = typeof fields.skills === 'string' 
      ? fields.skills.split(',').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(fields.skills) ? fields.skills : []);

    await CandidateModel.create({
      name: fullName,
      first_name: fields.firstName || '',
      last_name: fields.lastName || '',
      email: fields.email || '',
      phone: fields.phone || '',
      gender: fields.gender || '',
      dob: fields.dob || '',
      city: fields.city || '',
      location: fields.city || fields.location || '',
      company: fields.company || '',
      designation: fields.designation || fields.current_role || '',
      current_role: fields.designation || fields.current_role || 'Executive Leadership',
      experience: fields.experience ? `${fields.experience} Years` : '10+ Years',
      annual_ctc: fields.annual_ctc || fields.currentCtc || '',
      degree: fields.degree || '',
      institute: fields.institute || '',
      function_area: fields.function || '',
      sector: fields.industry || fields.sector || 'Heavy Engineering & Industrial',
      key_skills: skillsArray,
      ug_qualification: fields.degree || '',
      cv_filename: savedCvFilename,
      cv_original_name: originalCvName
    });

    // Prepare email attachments if CV was uploaded
    const emailAttachments = [];
    if (savedCvFilename) {
      const filePath = path.join(UPLOADS_DIR, savedCvFilename);
      if (fs.existsSync(filePath)) {
        emailAttachments.push({
          filename: originalCvName || savedCvFilename,
          path: filePath
        });
      }
    }

    // Trigger instant email alert with attached resume
    sendNotificationEmail({
      subject: `👤 [New Candidate CV] ${fullName} - ${fields.designation || fields.current_role || 'Leadership Role'}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px; color: #0b1a2f;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background: #0b1a2f; padding: 20px 24px; border-bottom: 3px solid #c49a45;">
              <h2 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 0.5px;">MCP CONSULTANTS</h2>
              <p style="color: #c49a45; margin: 4px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">New Candidate Profile &amp; Attached CV</p>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 16px; margin-top: 0;">An executive candidate has submitted their resume:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 140px;"><strong>Candidate Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${escapeHtml(fullName)}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Designation / Role:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${escapeHtml(fields.designation || fields.current_role || 'N/A')}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Company:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(fields.company || 'N/A')}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>City / Location:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(fields.city || 'N/A')}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Experience / CTC:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(fields.experience ? fields.experience + ' Yrs' : 'N/A')} | CTC: ₹${escapeHtml(fields.currentCtc || fields.annual_ctc || 'N/A')}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Education / Institute:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(fields.degree || 'N/A')} (${escapeHtml(fields.institute || 'N/A')})</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Function / Industry:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(fields.function || 'N/A')} | ${escapeHtml(fields.industry || fields.sector || 'N/A')}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Skills:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(skillsArray.join(', ') || 'N/A')}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(fields.email)}" style="color: #0b1a2f;">${escapeHtml(fields.email)}</a></td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Mobile:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${escapeHtml(fields.phone)}" style="color: #0b1a2f;">${escapeHtml(fields.phone || 'N/A')}</a></td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Resume File:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #16a34a; font-weight: bold;">${savedCvFilename ? '📎 ' + escapeHtml(originalCvName || savedCvFilename) + ' (Attached to this email)' : 'No file uploaded'}</td></tr>
              </table>
              <div style="margin-top: 24px; text-align: center;">
                <a href="http://localhost:${PORT}/admin" style="background: #0b1a2f; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Open Admin Dashboard &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      `,
      attachments: emailAttachments
    });

    res.status(200).json({
      success: true,
      database: 'MongoDB Atlas',
      message: 'Executive candidate profile and CV recorded successfully.',
      fileSaved: !!file
    });
  } catch (err) {
    console.error('Error recording candidate:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/inquiry
exports.postInquiry = async (req, res) => {
  try {
    const data = req.body || {};
    const file = req.file || null;

    const savedCvFilename = file ? (file.savedFilename || file.filename) : null;
    const originalCvName = file ? (file.originalName || file.originalname) : null;

    await InquiryModel.create({
      name: data.name || 'Anonymous',
      email: data.email || '',
      phone: data.phone || '',
      topic: data.topic || '',
      message: data.message || '',
      cv_filename: savedCvFilename,
      cv_original_name: originalCvName
    });

    // Prepare email attachments if CV or document was uploaded
    const emailAttachments = [];
    if (savedCvFilename) {
      const filePath = path.join(UPLOADS_DIR, savedCvFilename);
      if (fs.existsSync(filePath)) {
        emailAttachments.push({
          filename: originalCvName || savedCvFilename,
          path: filePath
        });
      }
    }

    // Trigger instant email alert
    sendNotificationEmail({
      subject: `✉️ [General Inquiry] ${data.topic || 'Website Inquiry'} from ${data.name || 'Visitor'}${savedCvFilename ? ' (Resume Attached)' : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px; color: #0b1a2f;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background: #0b1a2f; padding: 20px 24px; border-bottom: 3px solid #c49a45;">
              <h2 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 0.5px;">MCP CONSULTANTS</h2>
              <p style="color: #c49a45; margin: 4px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">General Contact Inquiry</p>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 16px; margin-top: 0;">A visitor has sent an inquiry through the contact form:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 140px;"><strong>Sender Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${escapeHtml(data.name)}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #0b1a2f;">${escapeHtml(data.email)}</a></td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${escapeHtml(data.phone)}" style="color: #0b1a2f;">${escapeHtml(data.phone || 'N/A')}</a></td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Topic / Sector:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${escapeHtml(data.topic)}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Message:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.message)}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Attached Resume / File:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #16a34a; font-weight: bold;">${savedCvFilename ? '📎 ' + escapeHtml(originalCvName || savedCvFilename) + ' (Attached to this email)' : 'No file uploaded'}</td></tr>
              </table>
              <div style="margin-top: 24px; text-align: center;">
                <a href="http://localhost:${PORT}/admin" style="background: #0b1a2f; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Open Admin Dashboard &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      `,
      attachments: emailAttachments
    });

    res.status(200).json({
      success: true,
      database: 'MongoDB Atlas',
      message: 'Inquiry received.'
    });
  } catch (err) {
    console.error('Error recording inquiry:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
