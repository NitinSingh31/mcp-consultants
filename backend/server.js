const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { connectMongoDB, getIsMongoConnected } = require('./config/db');
const { mailTransporter, NOTIFICATION_EMAILS } = require('./config/mailer');
const { seedDefaultAdmin } = require('./seeds/adminSeed');
const { UPLOADS_DIR } = require('./middleware/upload');
const { requireAdmin } = require('./middleware/auth');

const submissionRoutes = require('./routes/submissionRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const adminRoutes = require('./routes/adminRoutes');
const jobPostingRoutes = require('./routes/jobPostingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers (Helmet)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// 1. General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/api', apiLimiter);

// 2. Strict Rate Limiter for Authentication & Password Reset
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many authentication attempts, please try again after 15 minutes.' }
});
app.use('/api/admin/login', authLimiter);
app.use('/api/admin/forgot-password', authLimiter);

// 3. Form Submission Rate Limiter (Prevents spamming inquiries/resumes)
const formSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Submission limit reached, please try again shortly.' }
});
app.use('/api/hiring', formSubmissionLimiter);
app.use('/api/candidate', formSubmissionLimiter);
app.use('/api/inquiry', formSubmissionLimiter);

// Health check endpoint for uptime and container health probes (Render, AWS, Docker)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'MCP CONSULTANTS API',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: getIsMongoConnected() ? 'connected' : 'disconnected',
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
    }
  });
});

// API Routes
app.use('/api', submissionRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobPostingRoutes);

// File downloads endpoint for uploaded CVs and job descriptions (Protected - Admin only)
app.get('/uploads/:filename', requireAdmin, (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(UPLOADS_DIR, filename);

  if (fs.existsSync(filePath)) {
    return res.download(filePath, filename);
  }
  return res.status(404).json({ error: 'Not Found', message: 'File not found.' });
});

// Static Single Page Application (SPA) Serving
const FRONTEND_DIST = path.join(__dirname, '../frontend/dist');
const LOCAL_DIST = path.join(__dirname, 'dist');
const baseDir = fs.existsSync(FRONTEND_DIST) ? FRONTEND_DIST : (fs.existsSync(LOCAL_DIST) ? LOCAL_DIST : null);

if (baseDir) {
  app.use(express.static(baseDir));
  app.use((req, res, next) => {
    // If request starts with /api or /uploads, do not fall back to index.html
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return res.status(404).json({ error: 'Not Found', message: `API endpoint ${req.method} ${req.originalUrl} not found.` });
    }
    res.sendFile(path.join(baseDir, 'index.html'));
  });
} else {
  // Pure API mode when no frontend dist is compiled yet
  app.get('/', (req, res) => {
    res.json({
      status: 'active',
      service: 'MCP CONSULTANTS API Server',
      database: getIsMongoConnected() ? 'Connected (MongoDB Atlas)' : 'Connecting...',
      documentation: 'Run the frontend dev server on http://localhost:5173 to access the full user experience.'
    });
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', message: `Cannot ${req.method} ${req.originalUrl}` });
  });
}

// Global Express Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected server error occurred.'
  });
});

// Server Startup
async function startServer() {
  const isConnected = await connectMongoDB();
  if (isConnected) {
    await seedDefaultAdmin();
  }

  app.listen(PORT, '0.0.0.0', () => {
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

module.exports = app;
