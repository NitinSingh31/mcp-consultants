const nodemailer = require('nodemailer');

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
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

module.exports = {
  mailTransporter,
  NOTIFICATION_EMAILS,
  escapeHtml,
  sendNotificationEmail
};
