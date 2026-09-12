const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.pdf';
    const safeName = `cv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB max file size
  }
});

// Middleware that accepts any single file upload under any field name (cv, document, etc.)
// and attaches it to req.file for standard controller consumption
const uploadAnySingle = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ success: false, error: err.message });
    }
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

module.exports = {
  upload,
  uploadAnySingle,
  UPLOADS_DIR
};
