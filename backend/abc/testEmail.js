const nodemailer = require('nodemailer');
require('dotenv').config();

async function test() {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "palakmathur2811@gmail.com",
    subject: "Test OTP",
    text: "This is a test email."
  });

  console.log("Email sent!");
}

test();
