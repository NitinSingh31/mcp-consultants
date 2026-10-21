const crypto = require('crypto');
const Admin = require('../models/Admin');
const { hashPassword } = require('../utils/crypto');

async function seedDefaultAdmin() {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      const salt = crypto.randomBytes(16).toString('hex');
      const initialPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'McpAdmin@2026';
      const passwordHash = hashPassword(initialPassword, salt);
      await Admin.create({
        username: process.env.ADMIN_DEFAULT_USER || 'admin',
        email: process.env.EMAIL_USER || 'Recruiter.mcpconsultants@gmail.com',
        passwordHash: passwordHash,
        salt: salt
      });
      console.log(`🔑 Initialized default Admin user: "${process.env.ADMIN_DEFAULT_USER || 'admin'}"`);
    }
  } catch (err) {
    console.error('Error seeding default admin:', err.message);
  }
}

module.exports = { seedDefaultAdmin };
