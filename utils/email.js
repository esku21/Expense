const nodemailer = require("nodemailer");

async function sendWelcomeEmail(email) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,   // your Gmail address
      pass: process.env.EMAIL_PASS    // your Gmail app password
    }
  });

  await transporter.sendMail({
    from: '"Expense Tracker" <no-reply@expensetracker.com>',
    to: email,
    subject: "Welcome to Expense Tracker",
    text: "Your account has been created successfully!"
  });
}

module.exports = sendWelcomeEmail;
