require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const MONGODB_URI = process.env.MONGODB_URI;

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// 1. Email Alert Configuration (nodemailer)
// ---------------------------------------------------------------------------
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const NOTIFICATION_EMAILS = process.env.NOTIFICATION_EMAILS || 'Recruiter.mcpconsultants@gmail.com, Shallu.mcpconsultants@gmail.com, Shikha.mcpconsultants@gmail.com';

let mailTransporter = null;
if (EMAIL_USER && EMAIL_PASS && !EMAIL_PASS.includes('your_')) {
  mailTransporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function sendNotificationEmail({ subject, html, attachments = [] }) {
  if (!mailTransporter) {
    console.log(`ℹ️  [Email Alert Triggered]: "${subject}"`);
    console.log(`ℹ️  Recipients: ${NOTIFICATION_EMAILS}`);
    console.log(`ℹ️  (To deliver live emails, set EMAIL_USER and EMAIL_PASS in your .env or host settings)`);
    return;
  }

  try {
    const info = await mailTransporter.sendMail({
      from: `"MCP CONSULTANTS Alerts" <${EMAIL_USER}>`,
      to: NOTIFICATION_EMAILS,
      subject: subject,
      html: html,
      attachments: attachments
    });
    console.log(`📧 Email alert successfully dispatched to [${NOTIFICATION_EMAILS}] (ID: ${info.messageId})`);
  } catch (err) {
    console.error('⚠️  Failed to send notification email:', err.message);
  }
}

// ---------------------------------------------------------------------------
// 2. MongoDB Setup & Mongoose Schemas
// ---------------------------------------------------------------------------
let isMongoConnected = false;

const mandateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: { type: String, required: true },
  sector: { type: String, required: true },
  leadership_level: { type: String, required: true },
  notes: String,
  doc_filename: String,
  doc_original_name: String,
  createdAt: { type: Date, default: Date.now }
});

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  current_role: { type: String, required: true },
  sector: { type: String, required: true },
  experience: { type: String, required: true },
  linkedin_url: String,
  cv_filename: String,
  cv_original_name: String,
  createdAt: { type: Date, default: Date.now }
});

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  topic: { type: String, required: true },
  message: { type: String, required: true },
  cv_filename: String,
  cv_original_name: String,
  createdAt: { type: Date, default: Date.now }
});

const MandateModel = mongoose.model('Mandate', mandateSchema);
const CandidateModel = mongoose.model('Candidate', candidateSchema);
const InquiryModel = mongoose.model('Inquiry', inquirySchema);

async function connectMongoDB() {
  if (!MONGODB_URI || MONGODB_URI.includes('<username>') || MONGODB_URI.includes('<password>')) {
    console.error('❌ MONGODB_URI is not properly configured in .env.');
    return;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000
    });
    isMongoConnected = true;
    console.log('✅ Successfully connected to MongoDB Atlas!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    isMongoConnected = false;
  }
}

// ---------------------------------------------------------------------------
// 3. Helper: Multipart/Form-Data Parser
// ---------------------------------------------------------------------------
function parseMultipart(req, boundary) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const boundaryBuffer = Buffer.from('--' + boundary);
      const parts = [];

      let start = 0;
      while ((start = buffer.indexOf(boundaryBuffer, start)) !== -1) {
        start += boundaryBuffer.length;
        if (buffer[start] === 0x2D && buffer[start + 1] === 0x2D) break; // End boundary '--'
        if (buffer[start] === 0x0D && buffer[start + 1] === 0x0A) start += 2; // CRLF

        const end = buffer.indexOf(boundaryBuffer, start);
        if (end === -1) break;

        const partBuffer = buffer.subarray(start, end - 2);
        parts.push(partBuffer);
      }

      const fields = {};
      let fileData = null;

      for (const part of parts) {
        const headerEnd = part.indexOf(Buffer.from('\r\n\r\n'));
        if (headerEnd === -1) continue;

        const headerStr = part.subarray(0, headerEnd).toString('utf8');
        const body = part.subarray(headerEnd + 4);

        const nameMatch = headerStr.match(/name="([^"]+)"/);
        const filenameMatch = headerStr.match(/filename="([^"]+)"/);

        if (filenameMatch && filenameMatch[1]) {
          const originalName = path.basename(filenameMatch[1]);
          if (originalName && body.length > 0) {
            const ext = path.extname(originalName) || '.pdf';
            const safeName = `cv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
            const targetPath = path.join(UPLOADS_DIR, safeName);
            fs.writeFileSync(targetPath, body);

            fileData = {
              savedFilename: safeName,
              originalName: originalName,
              size: body.length
            };
          }
        } else if (nameMatch && nameMatch[1]) {
          fields[nameMatch[1]] = body.toString('utf8').trim();
        }
      }

      resolve({ fields, file: fileData });
    });
    req.on('error', reject);
  });
}

function parseJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// ---------------------------------------------------------------------------
// 4. HTTP Server & REST API
// ---------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split('?');
  const pathname = urlParts[0];

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // -------------------------------------------------------------------------
  // API: Status / Health & Database info
  // -------------------------------------------------------------------------
  if (req.method === 'GET' && pathname === '/api/db-status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      database: 'MongoDB Atlas',
      connected: isMongoConnected,
      emailAlertsActive: !!mailTransporter
    }));
    return;
  }

  // -------------------------------------------------------------------------
  // API 1: POST /api/hiring - Save client executive search mandate
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/hiring') {
    try {
      const contentType = req.headers['content-type'] || '';
      let data = {};
      let file = null;

      if (contentType.includes('multipart/form-data')) {
        const boundary = contentType.split('boundary=')[1]?.trim().replace(/^["']|["']$/g, '');
        const parsed = await parseMultipart(req, boundary);
        data = parsed.fields;
        file = parsed.file;
      } else {
        data = await parseJson(req);
      }

      await MandateModel.create({
        name: data.name || 'Anonymous',
        email: data.email || '',
        phone: data.phone || '',
        company: data.company || '',
        sector: data.sector || '',
        leadership_level: data.leadership_level || '',
        notes: data.notes || '',
        doc_filename: file ? file.savedFilename : null,
        doc_original_name: file ? file.originalName : null
      });

      // Prepare email attachments if JD/spec was uploaded
      const emailAttachments = [];
      if (file && file.savedFilename) {
        const filePath = path.join(UPLOADS_DIR, file.savedFilename);
        if (fs.existsSync(filePath)) {
          emailAttachments.push({
            filename: file.originalName || file.savedFilename,
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
                  <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Attached Document:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #16a34a; font-weight: bold;">${file ? '📎 ' + escapeHtml(file.originalName) + ' (Attached to this email)' : 'No file attached'}</td></tr>
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

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        database: 'MongoDB Atlas',
        message: 'Mandate inquiry recorded successfully.'
      }));
    } catch (err) {
      console.error('Error recording mandate:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------------------
  // API 2: POST /api/candidate - Save executive profile & resume upload
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/candidate') {
    try {
      const contentType = req.headers['content-type'] || '';
      let fields = {};
      let file = null;

      if (contentType.includes('multipart/form-data')) {
        const boundary = contentType.split('boundary=')[1]?.trim().replace(/^["']|["']$/g, '');
        const parsed = await parseMultipart(req, boundary);
        fields = parsed.fields;
        file = parsed.file;
      } else {
        fields = await parseJson(req);
      }

      await CandidateModel.create({
        name: fields.name || 'Anonymous',
        email: fields.email || '',
        phone: fields.phone || '',
        current_role: fields.current_role || '',
        sector: fields.sector || '',
        experience: fields.experience || '',
        linkedin_url: fields.linkedin_url || '',
        cv_filename: file ? file.savedFilename : null,
        cv_original_name: file ? file.originalName : null
      });

      // Prepare email attachments if CV was uploaded
      const emailAttachments = [];
      if (file && file.savedFilename) {
        const filePath = path.join(UPLOADS_DIR, file.savedFilename);
        if (fs.existsSync(filePath)) {
          emailAttachments.push({
            filename: file.originalName || file.savedFilename,
            path: filePath
          });
        }
      }

      // Trigger instant email alert with attached resume
      sendNotificationEmail({
        subject: `👤 [New Candidate CV] ${fields.name || 'Executive'} - ${fields.current_role || 'Leadership Role'}`,
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
                  <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 140px;"><strong>Candidate Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${escapeHtml(fields.name)}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Current Role:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${escapeHtml(fields.current_role)}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Industry Sector:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(fields.sector)}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Experience:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(fields.experience)}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(fields.email)}" style="color: #0b1a2f;">${escapeHtml(fields.email)}</a></td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${escapeHtml(fields.phone)}" style="color: #0b1a2f;">${escapeHtml(fields.phone || 'N/A')}</a></td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>LinkedIn:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${fields.linkedin_url ? `<a href="${escapeHtml(fields.linkedin_url)}" target="_blank" style="color: #c49a45; font-weight: bold;">View LinkedIn Profile &rarr;</a>` : 'Not provided'}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Resume File:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #16a34a; font-weight: bold;">${file ? '📎 ' + escapeHtml(file.originalName) + ' (Attached to this email)' : 'No file uploaded'}</td></tr>
                </table>
                <div style="margin-top: 24px; text-align: center;">
                  <a href="http://localhost:${PORT}/admin.html" style="background: #0b1a2f; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Open Admin Dashboard &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        `,
        attachments: emailAttachments
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        database: 'MongoDB Atlas',
        message: 'Executive candidate profile and CV recorded successfully.',
        fileSaved: !!file
      }));
    } catch (err) {
      console.error('Error recording candidate:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------------------
  // API 3: POST /api/inquiry - Save general inquiry
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/inquiry') {
    try {
      const contentType = req.headers['content-type'] || '';
      let data = {};
      let file = null;

      if (contentType.includes('multipart/form-data')) {
        const boundary = contentType.split('boundary=')[1]?.trim().replace(/^["']|["']$/g, '');
        const parsed = await parseMultipart(req, boundary);
        data = parsed.fields;
        file = parsed.file;
      } else {
        data = await parseJson(req);
      }

      await InquiryModel.create({
        name: data.name || 'Anonymous',
        email: data.email || '',
        phone: data.phone || '',
        topic: data.topic || '',
        message: data.message || '',
        cv_filename: file ? file.savedFilename : null,
        cv_original_name: file ? file.originalName : null
      });

      // Prepare email attachments if CV or document was uploaded
      const emailAttachments = [];
      if (file && file.savedFilename) {
        const filePath = path.join(UPLOADS_DIR, file.savedFilename);
        if (fs.existsSync(filePath)) {
          emailAttachments.push({
            filename: file.originalName || file.savedFilename,
            path: filePath
          });
        }
      }

      // Trigger instant email alert
      sendNotificationEmail({
        subject: `✉️ [General Inquiry] ${data.topic || 'Website Inquiry'} from ${data.name || 'Visitor'}${file ? ' (Resume Attached)' : ''}`,
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
                  <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Attached Resume / File:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #16a34a; font-weight: bold;">${file ? '📎 ' + escapeHtml(file.originalName) + ' (Attached to this email)' : 'No file uploaded'}</td></tr>
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

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        database: 'MongoDB Atlas',
        message: 'Inquiry received.'
      }));
    } catch (err) {
      console.error('Error recording inquiry:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------------------
  // API 4: GET /api/admin/submissions - Return all data for Admin Dashboard
  // -------------------------------------------------------------------------
  if (req.method === 'GET' && pathname === '/api/admin/submissions') {
    try {
      const mList = await MandateModel.find().sort({ createdAt: -1 }).lean();
      const cList = await CandidateModel.find().sort({ createdAt: -1 }).lean();
      const iList = await InquiryModel.find().sort({ createdAt: -1 }).lean();

      // Format MongoDB documents with id and created_at
      const mandates = mList.map(m => ({ ...m, id: m._id.toString().slice(-6), created_at: m.createdAt }));
      const candidates = cList.map(c => ({ ...c, id: c._id.toString().slice(-6), created_at: c.createdAt }));
      const inquiries = iList.map(i => ({ ...i, id: i._id.toString().slice(-6), created_at: i.createdAt }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        activeDatabase: 'MongoDB Atlas',
        stats: {
          mandatesCount: mandates.length,
          candidatesCount: candidates.length,
          inquiriesCount: inquiries.length
        },
        mandates,
        candidates,
        inquiries
      }));
    } catch (err) {
      console.error('Error fetching admin data:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------------------
  // API 5: Download CV: /uploads/:filename
  // -------------------------------------------------------------------------
  if (pathname.startsWith('/uploads/')) {
    const filename = path.basename(pathname);
    const filePath = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // -------------------------------------------------------------------------
  // Static Files & Single Page Application (SPA) Serving
  // -------------------------------------------------------------------------
  const DIST_DIR = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(DIST_DIR);
  const baseDir = hasDist ? DIST_DIR : PUBLIC_DIR;

  let reqPath = pathname === '/' ? '/index.html' : pathname;
  let targetFile = path.join(baseDir, reqPath);

  fs.stat(targetFile, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(targetFile).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(targetFile).pipe(res);
      return;
    }

    // SPA fallback: Serve index.html for client-side routing
    const spaIndex = path.join(baseDir, 'index.html');
    if (fs.existsSync(spaIndex)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      fs.createReadStream(spaIndex).pipe(res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  });
});

async function startServer() {
  await connectMongoDB();
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 MCP CONSULTANTS Server running at http://localhost:${PORT}/`);
    console.log(`🗄️  Database: MongoDB Atlas (Cloud)`);
    console.log(`📧 Email Alerts: ${mailTransporter ? 'Active (Live)' : 'Standby (Configure EMAIL_USER & EMAIL_PASS in .env)'}`);
    console.log(`📬 Recipients: ${NOTIFICATION_EMAILS}`);
    console.log(`📊 Admin Portal: http://localhost:${PORT}/admin`);
    console.log(`======================================================\n`);
  });
}

startServer();
