const AdminModel = require('../models/Admin');

async function getAuthenticatedAdmin(req) {
  const authHeader = req.headers['authorization'] || '';
  let token = '';
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.query && req.query.token) {
    token = String(req.query.token).trim();
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

async function requireAdmin(req, res, next) {
  const admin = await getAuthenticatedAdmin(req);
  if (!admin) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Please sign in to access the executive practice portal.'
    });
  }
  req.admin = admin;
  next();
}

module.exports = {
  getAuthenticatedAdmin,
  requireAdmin
};
