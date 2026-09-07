require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const MONGODB_URI = process.env.MONGODB_URI;

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// 1. MongoDB Setup & Mongoose Schemas
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
// 2. Helper: Multipart/Form-Data Parser
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
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword'
};

// ---------------------------------------------------------------------------
// 3. HTTP Server & REST API
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
      connected: isMongoConnected
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

      if (contentType.includes('multipart/form-data')) {
        const boundary = contentType.split('boundary=')[1]?.trim().replace(/^["']|["']$/g, '');
        const parsed = await parseMultipart(req, boundary);
        data = parsed.fields;
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
        notes: data.notes || ''
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

      if (contentType.includes('multipart/form-data')) {
        const boundary = contentType.split('boundary=')[1]?.trim().replace(/^["']|["']$/g, '');
        const parsed = await parseMultipart(req, boundary);
        data = parsed.fields;
      } else {
        data = await parseJson(req);
      }

      await InquiryModel.create({
        name: data.name || 'Anonymous',
        email: data.email || '',
        phone: data.phone || '',
        topic: data.topic || '',
        message: data.message || ''
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
  // Static Files Serving
  // -------------------------------------------------------------------------
  let reqPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(PUBLIC_DIR, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

async function startServer() {
  await connectMongoDB();
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 MCP CONSULTANTS Server running at http://localhost:${PORT}/`);
    console.log(`🗄️  Database: MongoDB Atlas (Cloud)`);
    console.log(`📊 Admin Portal: http://localhost:${PORT}/admin.html`);
    console.log(`======================================================\n`);
  });
}

startServer();
