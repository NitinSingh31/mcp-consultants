const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const { connectMongoDB, getIsMongoConnected } = require('./config/db');
const { mailTransporter, NOTIFICATION_EMAILS } = require('./config/mailer');
const { seedDefaultAdmin } = require('./seeds/adminSeed');
const { seedSampleCandidates } = require('./seeds/candidateSeed');
const { UPLOADS_DIR } = require('./middleware/upload');

const submissionRoutes = require('./routes/submissionRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const adminRoutes = require('./routes/adminRoutes');
const jobPostingRoutes = require('./routes/jobPostingRoutes');
const { seedSampleJobPostings } = require('./controllers/jobPostingController');

const app = express();
const PORT = process.env.PORT || 3000;

// Core Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// API Routes
app.use('/api', submissionRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobPostingRoutes);

// File downloads endpoint for uploaded CVs and job descriptions
app.get('/uploads/:filename', (req, res) => {
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
  app.use((req, res) => {
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

// Server Startup
async function startServer() {
  const isConnected = await connectMongoDB();
  if (isConnected) {
    await seedDefaultAdmin();
    await seedSampleCandidates();
    await seedSampleJobPostings();
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
