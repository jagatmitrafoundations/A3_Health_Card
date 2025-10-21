// utils/emailOtp.js
const nodemailer = require('nodemailer');
const store = new Map(); // key -> { otp, expires } ;
const TTL = (process.env.OTP_TTL_SECONDS ? Number(process.env.OTP_TTL_SECONDS) : 300) * 1000;
function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured');
  }
  
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
async function sendEmail(to, subject, text) {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
  } catch (error) {
    console.warn('Failed to send email:', error.message);
    throw error;
  }
}
async function sendOtpEmail(to, otp) {
  const subject = 'Your OTP code';
  const text = `Your OTP is ${otp}. It is valid for ${TTL/1000} seconds.`;
  await sendEmail(to, subject, text);
}
async function sendSignupEmail(to, text) {
  const subject = 'Welcome to JagatMitra-Care';
  await sendEmail(to, subject, text);
}
// async function sendsignupEmaill(to, subject, text) {
//   if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
//     console.warn('MAIL not configured - OTP:', text);
//     return;
//   }
//   const transporter = nodemailer.createTransport({
//     service: 'gmail', // or use SendGrid SMTP
//     auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
//   });

//   await transporter.sendMail({
//     from: process.env.MAIL_USER,
//     to,
//     subject,
//     text
//   });

// }
// async function sendEmail(to, otp) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail', // or use SendGrid SMTP
//     auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
//   });

//   await transporter.sendMail({
//     from: process.env.MAIL_USER,
//     to,
//     subject: 'Your OTP code',
//     text: `Your OTP is ${otp}. It is valid for ${TTL/1000} seconds.`
//   });
// }

function saveOtp(key, otp) {
  store.set(key, { otp, expires: Date.now() + TTL });
}

function verifyOtp(key, otp) {
  const rec = store.get(key);
  if (!rec) return false;
  if (Date.now() > rec.expires) { store.delete(key); return false; }
  if (rec.otp === otp) { store.delete(key); return true; }
  return false;
}

module.exports = { generateOtp, sendEmail, sendOtpEmail, sendSignupEmail, saveOtp, verifyOtp };
