const dns = require("dns");
const nodemailer = require("nodemailer");

const host = process.env.EMAIL_HOST || "smtp.zoho.in";
const port = Number(process.env.EMAIL_PORT || 587);
const secure = port === 465;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!user || !pass) {
  console.error("EMAIL CONFIG ERROR: EMAIL_USER or EMAIL_PASS is missing.");
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user,
    pass,
  },
  // Force IPv4 so SMTP does not fail on unreachable IPv6 routes in hosting environments.
  lookup: (hostname, options, callback) => dns.lookup(hostname, { family: 4 }, callback),
  tls: {
    rejectUnauthorized: false,
  },
});

let verifyPromise;

const verifyTransporter = async () => {
  if (!verifyPromise) {
    verifyPromise = transporter.verify().catch((error) => {
      verifyPromise = undefined;
      throw error;
    });
  }

  return verifyPromise;
};

module.exports = async (to, otp, subject = "MACROC TEAM - OTP Verification") => {
  if (!user || !pass) {
    throw new Error("Email service not configured. Missing EMAIL_USER or EMAIL_PASS.");
  }

  try {
    await verifyTransporter();
  } catch (error) {
    throw new Error(`SMTP verify failed (${host}:${port}, secure=${secure}): ${error.message}`);
  }

  const mailOptions = {
    from: `"MACROC TEAM" <${user}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a;">
        <h2 style="margin: 0 0 12px;">OTP Verification</h2>
        <p style="margin: 0 0 8px;">Your OTP is:</p>
        <h1 style="color:#2563eb; letter-spacing:2px; margin: 0 0 12px;">${otp}</h1>
        <p style="margin: 0 0 4px;">This OTP is valid for 5 minutes.</p>
        <small>If you did not request this, you can ignore this email.</small>
      </div>
    `,
  };

  let info;
  try {
    info = await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`SMTP send failed (${host}:${port}, secure=${secure}): ${error.message}`);
  }

  return info;
};
