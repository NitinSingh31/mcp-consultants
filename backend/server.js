const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
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
  company: String,
  sector: { type: String, required: true },
  experience: { type: String, required: true },
  location: String,
  key_skills: [String],
  notice_period: String,
  ug_qualification: String,
  pg_qualification: String,
  gender: String,
  annual_ctc: String,
  verified_mobile: { type: Boolean, default: true },
  verified_email: { type: Boolean, default: true },
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

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true },
  resetOtp: String,
  resetOtpExpires: Date,
  sessionToken: String,
  sessionTokenExpires: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MandateModel = mongoose.model('Mandate', mandateSchema);
const CandidateModel = mongoose.model('Candidate', candidateSchema);
const InquiryModel = mongoose.model('Inquiry', inquirySchema);
const AdminModel = mongoose.model('Admin', adminSchema);

// Password Hashing & Verification
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password, hash, salt) {
  try {
    const checkHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(checkHash, 'hex'));
  } catch (e) {
    return false;
  }
}

// Initial Default Admin Seeding in MongoDB
async function seedDefaultAdmin() {
  try {
    const count = await AdminModel.countDocuments();
    if (count === 0) {
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword('McpAdmin@2026', salt);
      await AdminModel.create({
        username: 'admin',
        email: 'Recruiter.mcpconsultants@gmail.com',
        passwordHash: passwordHash,
        salt: salt
      });
      console.log('🔑 Initialized default Admin user: "admin" (Initial Password: McpAdmin@2026)');
    }
  } catch (err) {
    console.error('Error seeding default admin:', err.message);
  }
}

// Seed Sample Executive Candidates for Resdex Search if database is empty/small
async function seedSampleCandidates() {
  try {
    const count = await CandidateModel.countDocuments();
    if (count < 6) {
      const samples = [
        {
          name: "Vikram Malhotra",
          email: "v.malhotra@executive-search.mcp",
          phone: "+91 98230 44120",
          current_role: "Vice President - Operations & Plant Manufacturing",
          company: "L&T Heavy Engineering",
          sector: "Heavy Engineering & Capital Goods",
          experience: "18 Years",
          location: "Pune, Maharashtra",
          key_skills: ["CNC Machining", "Six Sigma Black Belt", "Heavy Fabrication", "Lean Manufacturing", "Plant P&L"],
          notice_period: "1 month",
          ug_qualification: "B.Tech Mechanical Engineering",
          pg_qualification: "M.Tech Production Engineering",
          gender: "Male",
          annual_ctc: "48 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-vmalhotra"
        },
        {
          name: "Pooja Deshmukh",
          email: "pooja.d@executive-search.mcp",
          phone: "+91 98112 33490",
          current_role: "Chief Technology Officer - EV Powertrain & Battery Systems",
          company: "Tata Motors Electric Mobility",
          sector: "Automotive & Electric Vehicles",
          experience: "15 Years",
          location: "Bengaluru, Karnataka",
          key_skills: ["Battery Management Systems (BMS)", "AUTOSAR", "Motor Controls", "Powertrain Integration", "Thermal Architecture"],
          notice_period: "0 - 15 days",
          ug_qualification: "B.E. Electrical & Electronics",
          pg_qualification: "MS Power Electronics (IISc)",
          gender: "Female",
          annual_ctc: "55 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-pdeshmukh"
        },
        {
          name: "Rajesh K. Sharma",
          email: "rajesh.sharma@executive-search.mcp",
          phone: "+91 97180 88200",
          current_role: "Head of Metallurgy, Blast Furnace & Hot Strip Mill",
          company: "JSW Steel Ltd",
          sector: "Steel & Metallurgy",
          experience: "21 Years",
          location: "Jamshedpur, Jharkhand",
          key_skills: ["Blast Furnace Operations", "Continuous Casting", "Alloy Metallurgy", "Cost Optimization", "ISO 9001"],
          notice_period: "2 months",
          ug_qualification: "B.Tech Metallurgical Engineering (IIT BHU)",
          pg_qualification: "MBA Operations",
          gender: "Male",
          annual_ctc: "42 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-rksharma"
        },
        {
          name: "Sunita Nair",
          email: "sunita.nair@executive-search.mcp",
          phone: "+91 99401 55621",
          current_role: "Director - Global Supply Chain & Strategic Sourcing",
          company: "Thermax Limited",
          sector: "Heavy Engineering & Capital Goods",
          experience: "16 Years",
          location: "Chennai, Tamil Nadu",
          key_skills: ["Strategic Sourcing", "Vendor Development", "ERP SAP S/4HANA", "Import-Export Compliance", "Contract Negotiation"],
          notice_period: "Currently serving notice period",
          ug_qualification: "B.Tech Industrial Engineering",
          pg_qualification: "Executive MBA (IIM Calcutta)",
          gender: "Female",
          annual_ctc: "38 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-snair"
        },
        {
          name: "Anand Verma",
          email: "anand.verma@executive-search.mcp",
          phone: "+91 98450 12890",
          current_role: "General Manager - Aerospace Composites & Avionics Quality",
          company: "Bharat Forge Aerospace",
          sector: "Aerospace & Defence",
          experience: "19 Years",
          location: "Hyderabad, Telangana",
          key_skills: ["AS9100 Rev D", "Titanium Forging", "NADCAP Audits", "Avionics Assemblies", "Defence Offsets"],
          notice_period: "1 month",
          ug_qualification: "B.Tech Aeronautical Engineering",
          pg_qualification: "M.Tech Materials Science",
          gender: "Male",
          annual_ctc: "45 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-averma"
        },
        {
          name: "Deepak Chawla",
          email: "deepak.c@executive-search.mcp",
          phone: "+91 98710 99011",
          current_role: "Head of Project Engineering - Solar & Wind EPC",
          company: "Suzlon Green Energy",
          sector: "Renewable Energy & CleanTech",
          experience: "14 Years",
          location: "Gurugram, Haryana",
          key_skills: ["Utility Scale EPC", "Grid Interconnection", "SCADA", "Turbine Erection", "PPA Execution"],
          notice_period: "3 months",
          ug_qualification: "B.Tech Electrical Engineering",
          pg_qualification: "PG Diploma Project Management",
          gender: "Male",
          annual_ctc: "35 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-dchawla"
        },
        {
          name: "Megha Sengupta",
          email: "megha.sengupta@executive-search.mcp",
          phone: "+91 98300 77412",
          current_role: "Chief Operating Officer (COO) - Industrial Automation & Robotics",
          company: "Kirloskar Automation Systems",
          sector: "Industrial Automation",
          experience: "22 Years",
          location: "Pune, Maharashtra",
          key_skills: ["Industrial IoT", "PLC & DCS Architecture", "Factory Automation", "Global P&L", "Transformational Leadership"],
          notice_period: "0 - 15 days",
          ug_qualification: "B.E. Instrumentation & Control",
          pg_qualification: "Executive Post Graduate (ISB)",
          gender: "Female",
          annual_ctc: "60 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-msengupta"
        },
        {
          name: "Arun Mehra",
          email: "arun.mehra@executive-search.mcp",
          phone: "+91 98201 66530",
          current_role: "Head of Heavy Fabrication & Pressure Vessels",
          company: "Godrej Process Equipment",
          sector: "Heavy Engineering & Capital Goods",
          experience: "17 Years",
          location: "Mumbai, Maharashtra",
          key_skills: ["ASME Section VIII", "Heavy Nuclear Vessels", "Welding Engineering", "Submerged Arc Welding", "Client Interface"],
          notice_period: "2 months",
          ug_qualification: "B.Tech Mechanical",
          pg_qualification: "Certified Welding Inspector (AWS)",
          gender: "Male",
          annual_ctc: "40 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-amehra"
        }
      ];

      await CandidateModel.insertMany(samples);
      console.log(`🎯 Seeded ${samples.length} executive candidate profiles for Resdex Talent Search.`);
    }
  } catch (err) {
    console.error('Error seeding sample candidates:', err.message);
  }
}

// Extract Authenticated Admin from Request Token
async function getAuthenticatedAdmin(req) {
  const authHeader = req.headers['authorization'] || '';
  let token = '';
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else {
    const urlParts = req.url.split('?');
    if (urlParts[1]) {
      const params = new URLSearchParams(urlParts[1]);
      token = params.get('token') || '';
    }
  }

  if (!token) return null;

  try {
    const admin = await AdminModel.findOne({
      sessionToken: token,
      sessionTokenExpires: { $gt: new Date() }
    });
    return admin;
  } catch (e) {
    return null;
  }
}

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
    await seedDefaultAdmin();
    await seedSampleCandidates();
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

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
  // Admin Auth 1: POST /api/admin/login - Authenticate with Username/Email & Password
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/admin/login') {
    try {
      const body = await parseJson(req);
      const identifier = (body.username || body.email || '').trim().toLowerCase();
      const password = body.password || '';

      if (!identifier || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Username/Email and Password are required.' }));
        return;
      }

      // Match username or email
      const admin = await AdminModel.findOne({
        $or: [
          { username: { $regex: new RegExp(`^${identifier}$`, 'i') } },
          { email: { $regex: new RegExp(`^${identifier}$`, 'i') } }
        ]
      });

      if (!admin || !verifyPassword(password, admin.passwordHash, admin.salt)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid credentials. Please verify your username and password.' }));
        return;
      }

      // Generate 7-day session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const sessionExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      admin.sessionToken = sessionToken;
      admin.sessionTokenExpires = sessionExpires;
      await admin.save();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        token: sessionToken,
        username: admin.username,
        email: admin.email,
        message: 'Authentication successful.'
      }));
    } catch (err) {
      console.error('Login error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------------------
  // Admin Auth 2: POST /api/admin/verify-session - Verify token validity on load
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/admin/verify-session') {
    try {
      const body = await parseJson(req);
      const token = body.token || '';

      if (!token) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'No token provided.' }));
        return;
      }

      const admin = await AdminModel.findOne({
        sessionToken: token,
        sessionTokenExpires: { $gt: new Date() }
      });

      if (!admin) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Session expired. Please log in again.' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        username: admin.username,
        email: admin.email
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------------------
  // Admin Auth 3: POST /api/admin/forgot-password - Send 6-digit OTP code to email
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/admin/forgot-password') {
    try {
      const body = await parseJson(req);
      const email = (body.email || '').trim().toLowerCase();

      if (!email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Email address is required.' }));
        return;
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
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'No admin account found for that email.' }));
        return;
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

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `A 6-digit verification code has been dispatched to ${email}. Check your inbox or spam folder.`
      }));
    } catch (err) {
      console.error('Forgot password error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------------------
  // Admin Auth 4: POST /api/admin/reset-password - Verify OTP and update password
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/admin/reset-password') {
    try {
      const body = await parseJson(req);
      const email = (body.email || '').trim().toLowerCase();
      const otp = (body.otp || '').trim();
      const newPassword = body.newPassword || '';

      if (!email || !otp || !newPassword) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Email, 6-digit OTP code, and new password are required.' }));
        return;
      }

      if (newPassword.length < 6) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'New password must be at least 6 characters long.' }));
        return;
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
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid or expired OTP code. Please request a new code.' }));
        return;
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

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        token: sessionToken,
        username: admin.username,
        email: admin.email,
        message: 'Password successfully reset! You are now logged in.'
      }));
    } catch (err) {
      console.error('Reset password error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------------------
  // Admin Auth 5: POST /api/admin/update-credentials - Change Username / Password from UI
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/admin/update-credentials') {
    try {
      const admin = await getAuthenticatedAdmin(req);
      if (!admin) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Unauthorized. Please log in first.' }));
        return;
      }

      const body = await parseJson(req);
      const currentPassword = body.currentPassword || '';
      const newUsername = (body.newUsername || '').trim();
      const newEmail = (body.newEmail || '').trim().toLowerCase();
      const newPassword = body.newPassword || '';

      if (!verifyPassword(currentPassword, admin.passwordHash, admin.salt)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Current password is incorrect. Authorization denied.' }));
        return;
      }

      if (newUsername && newUsername !== admin.username) {
        const conflict = await AdminModel.findOne({ username: newUsername, _id: { $ne: admin._id } });
        if (conflict) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'This username is already taken by another admin.' }));
          return;
        }
        admin.username = newUsername;
      }

      if (newEmail) {
        admin.email = newEmail;
      }

      if (newPassword) {
        if (newPassword.length < 6) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'New password must be at least 6 characters long.' }));
          return;
        }
        const salt = crypto.randomBytes(16).toString('hex');
        admin.salt = salt;
        admin.passwordHash = hashPassword(newPassword, salt);
      }

      admin.updatedAt = new Date();
      await admin.save();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        username: admin.username,
        email: admin.email,
        message: 'Account credentials updated successfully in MongoDB!'
      }));
    } catch (err) {
      console.error('Update credentials error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------------------
  // Admin Auth 6: POST /api/admin/logout - Clear session
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/admin/logout') {
    try {
      const admin = await getAuthenticatedAdmin(req);
      if (admin) {
        admin.sessionToken = null;
        admin.sessionTokenExpires = null;
        await admin.save();
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Logged out successfully.' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------------------
  // API 4: GET /api/admin/submissions - Return all data for Admin Dashboard (PROTECTED)
  // -------------------------------------------------------------------------
  if (req.method === 'GET' && pathname === '/api/admin/submissions') {
    try {
      // Secure authentication check
      const authAdmin = await getAuthenticatedAdmin(req);
      if (!authAdmin) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Unauthorized. Please sign in to access the executive practice portal.' }));
        return;
      }

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
      }));
    } catch (err) {
      console.error('Error fetching admin data:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------------------
  // Resdex API 1: POST /api/candidates/search - Advanced Candidate Search
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/candidates/search') {
    try {
      const body = await parseJson(req);
      const {
        keywords = '',
        booleanMode = false,
        client = '',
        minExp = '',
        maxExp = '',
        industry = '',
        company = '',
        excludeCompany = '',
        designation = '',
        noticePeriod = 'Any',
        ugQualification = 'Any',
        pgQualification = 'Any',
        gender = 'All',
        displayFilter = 'All candidates',
        verifiedMobileOnly = false,
        verifiedEmailOnly = false,
        attachedResumeOnly = false
      } = body;

      const query = {};

      // Keywords match across name, current_role, company, sector, key_skills
      if (keywords && keywords.trim()) {
        const terms = keywords.trim().split(/[\s,]+/).filter(Boolean);
        if (terms.length > 0) {
          const regexes = terms.map(t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
          query.$or = [
            { name: { $in: regexes } },
            { current_role: { $in: regexes } },
            { sector: { $in: regexes } },
            { company: { $in: regexes } },
            { key_skills: { $in: regexes } }
          ];
        }
      }

      // Sector / Industry filter
      if (industry && industry.trim() && industry !== 'Any' && industry !== 'All') {
        query.sector = { $regex: new RegExp(industry.trim(), 'i') };
      }

      // Company filter
      if (company && company.trim()) {
        query.company = { $regex: new RegExp(company.trim(), 'i') };
      }

      // Exclude Company filter
      if (excludeCompany && excludeCompany.trim()) {
        query.company = { ...(query.company || {}), $not: new RegExp(excludeCompany.trim(), 'i') };
      }

      // Designation filter
      if (designation && designation.trim()) {
        query.current_role = { $regex: new RegExp(designation.trim(), 'i') };
      }

      // Notice period filter
      if (noticePeriod && noticePeriod !== 'Any' && noticePeriod.trim()) {
        const cleanNotice = noticePeriod.replace('+', '').trim();
        query.notice_period = { $regex: new RegExp(cleanNotice, 'i') };
      }

      // Gender filter
      if (gender && gender !== 'All' && gender !== 'All candidates') {
        const targetGender = gender.includes('Female') ? 'Female' : 'Male';
        query.gender = targetGender;
      }

      // Resume attached filter
      if (attachedResumeOnly) {
        query.cv_filename = { $exists: true, $ne: '' };
      }

      let candidates = await CandidateModel.find(query).sort({ createdAt: -1 }).lean();

      // Numerical Experience Filter
      const minYears = minExp ? parseInt(minExp, 10) : null;
      const maxYears = maxExp ? parseInt(maxExp, 10) : null;

      if (minYears !== null || maxYears !== null) {
        candidates = candidates.filter(c => {
          const match = (c.experience || '').match(/\d+/);
          const years = match ? parseInt(match[0], 10) : 0;
          if (minYears !== null && years < minYears) return false;
          if (maxYears !== null && years > maxYears) return false;
          return true;
        });
      }

      const results = candidates.map(c => ({
        ...c,
        id: c._id.toString().slice(-6),
        created_at: c.createdAt
      }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        total: results.length,
        candidates: results,
        querySummary: {
          keywords,
          industry,
          company,
          designation,
          noticePeriod,
          minExp,
          maxExp,
          gender
        }
      }));
    } catch (err) {
      console.error('Candidate search error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------------------
  // Resdex API 2: GET /api/candidates/recent-searches
  // -------------------------------------------------------------------------
  if (req.method === 'GET' && pathname === '/api/candidates/recent-searches') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      recentSearches: [
        {
          id: 'rs-1',
          title: '<= 8.50 Lacs | Baddi, Kalka, Nalagarh, Ramshahr, Kasauli, Krishangarh, Pachhad, Naya Gaon, Dharampur, Chandigarh...',
          query: {
            keywords: 'Production Supervisor Quality Plant',
            industry: 'Heavy Engineering & Capital Goods',
            noticePeriod: '0 - 15 days',
            minExp: '3',
            maxExp: '8'
          }
        },
        {
          id: 'rs-2',
          title: 'amit kumar',
          query: {
            keywords: 'Amit Kumar',
            industry: 'Any',
            noticePeriod: 'Any',
            minExp: '',
            maxExp: ''
          }
        },
        {
          id: 'rs-3',
          title: 'Recent Search 3 (EV & Powertrain)',
          query: {
            keywords: 'Battery Management Systems Powertrain',
            industry: 'Automotive & Electric Vehicles',
            noticePeriod: '1 month',
            minExp: '10',
            maxExp: '18'
          }
        },
        {
          id: 'rs-4',
          title: '<= 9 Lacs (CNC & Metallurgy)',
          query: {
            keywords: 'CNC Machining Metallurgy Heavy',
            industry: 'Steel & Metallurgy',
            noticePeriod: 'Any',
            minExp: '5',
            maxExp: '12'
          }
        }
      ],
      savedSearches: [
        {
          id: 'ss-1',
          name: 'HR 04- 09',
          summary: 'Recruitment | <= 20 Lacs | Anywhere in North India, Anywhere in South India...',
          query: {
            keywords: 'Vice President General Manager Operations',
            industry: 'Heavy Engineering & Capital Goods',
            noticePeriod: '1 month',
            minExp: '15',
            maxExp: '25'
          }
        }
      ]
    }));
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
  const FRONTEND_DIST = path.join(__dirname, '../frontend/dist');
  const LOCAL_DIST = path.join(__dirname, 'dist');
  const baseDir = fs.existsSync(FRONTEND_DIST) ? FRONTEND_DIST : (fs.existsSync(LOCAL_DIST) ? LOCAL_DIST : null);

  if (baseDir) {
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

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found', message: 'Resource not found.' }));
    });
    return;
  }

  // Pure API mode when no frontend dist is compiled yet
  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'active',
      service: 'MCP CONSULTANTS API Server',
      database: isMongoConnected ? 'Connected (MongoDB Atlas)' : 'Connecting...',
      documentation: 'Run the frontend dev server on http://localhost:5173 to access the full user experience.'
    }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found', message: `Cannot ${req.method} ${pathname}` }));
});

async function startServer() {
  await connectMongoDB();
  server.listen(PORT, '0.0.0.0', () => {
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
