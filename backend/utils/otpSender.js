const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

// Twilio client initialization
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
function getEmailTransporter(email) {
  // Check if it's a .gov email
  if (email.endsWith('.gov') || email.includes('.gov.')) {
    // For .gov emails, use SMTP with standard settings
    // Most government emails use standard SMTP
    return nodemailer.createTransport({
      host: 'smtp.gmail.com', // You can use Gmail as relay or configure specific gov SMTP
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // Accept self-signed certificates if needed
      }
    });
  } else {
    // For regular emails (gmail, etc.)
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
}
// ✅ NEW: Smart phone number formatting function
function formatMobileNumber(mobile) {
  if (!mobile) return null;
  
  console.log(`📱 FORMATTING INPUT: "${mobile}"`);
  
  // If mobile already starts with '+', use it as-is
  if (mobile.startsWith('+')) {
    console.log(`📱 ALREADY HAS +: "${mobile}" → keeping as-is`);
    return mobile;
  }
  
  // If mobile doesn't start with '+', add +91
  const formatted = `+91${mobile}`;
  console.log(`📱 NO + PREFIX: "${mobile}" → "${formatted}"`);
  return formatted;
}

async function sendOtpToEmailOrPhone(email, mobile, otp) {
  // if (email) {
  //   let transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: process.env.EMAIL_USER,
  //       pass: process.env.EMAIL_PASS
  //     }
  //   });

  //   await transporter.sendMail({
  //     from: process.env.EMAIL_USER,
  //     to: email,
  //     subject: "Your OTP Code",
  //     text: `Your OTP is ${otp}. It is valid for 5 minutes.`
  //   });
  // }
  if (email) {
    try {
      let transporter = getEmailTransporter(email);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code - JagatMitra Care",
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        
      };
      await transporter.sendMail(mailOptions);
      console.log(`OTP ${otp} sent to email ${email}`);
    } catch (error) {
      console.error('Failed to send email OTP:', error);
      throw error;
    }
  }
  if (mobile) {
    try {

      await client.messages.create({
        body: `Your OTP for verification is ${otp}`,
        
        to: formatMobileNumber(mobile), // Use the formatting function here
        from: process.env.TWILIO_PHONE_NUMBER
      });
      console.log(`OTP ${otp} sent to mobile ${mobile} via Twilio.`);
    } catch (error) {
      console.error('Failed to send SMS via Twilio:', error);
    }
  }
}

module.exports = { sendOtpToEmailOrPhone };