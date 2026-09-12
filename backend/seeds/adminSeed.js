const crypto = require('crypto');
const Admin = require('../models/Admin');
const { hashPassword } = require('../utils/crypto');

async function seedDefaultAdmin() {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword('McpAdmin@2026', salt);
      await Admin.create({
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

module.exports = { seedDefaultAdmin };
