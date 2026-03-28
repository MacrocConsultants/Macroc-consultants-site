const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.zoho.in",
  port: process.env.EMAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = async ({ name, email, mobile, serviceRequired, message }) => {
  const notificationReceiver =
    process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER;

  if (!notificationReceiver) {
    return;
  }

  const mailOptions = {
    from: `"MACROC-TEAM" <${process.env.EMAIL_USER}>`,
    to: notificationReceiver,
    replyTo: email,
    subject: `New Website Contact Message - ${serviceRequired}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="margin-bottom: 16px;">New Contact Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Service:</strong> ${serviceRequired}</p>
        <p><strong>Message:</strong></p>
        <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; white-space: pre-line;">${message}</div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
