const dns = require("dns");
const nodemailer = require("nodemailer");

const provider = (process.env.EMAIL_PROVIDER || "resend").toLowerCase();

const smtpHost = process.env.EMAIL_HOST || "smtp.zoho.in";
const smtpPort = Number(process.env.EMAIL_PORT || 587);
const smtpSecure = smtpPort === 465;
const smtpUser = process.env.EMAIL_USER;
const smtpPass = process.env.EMAIL_PASS;

const resendApiKey = process.env.RESEND_API_KEY || "";
const resendFromEmail = process.env.RESEND_FROM_EMAIL || smtpUser || "";

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
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

const buildHtml = (otp) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a;">
    <h2 style="margin: 0 0 12px;">OTP Verification</h2>
    <p style="margin: 0 0 8px;">Your OTP is:</p>
    <h1 style="color:#2563eb; letter-spacing:2px; margin: 0 0 12px;">${otp}</h1>
    <p style="margin: 0 0 4px;">This OTP is valid for 5 minutes.</p>
    <small>If you did not request this, you can ignore this email.</small>
  </div>
`;

const sendWithResend = async ({ to, subject, html }) => {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  if (!resendFromEmail) {
    throw new Error("RESEND_FROM_EMAIL is missing.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [to],
      subject,
      html,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`Resend API failed (${response.status}): ${data.message || JSON.stringify(data)}`);
  }

  return data;
};

const sendWithSmtp = async ({ to, subject, html }) => {
  if (!smtpUser || !smtpPass) {
    throw new Error("Email service not configured. Missing EMAIL_USER or EMAIL_PASS.");
  }

  try {
    await verifyTransporter();
  } catch (error) {
    throw new Error(`SMTP verify failed (${smtpHost}:${smtpPort}, secure=${smtpSecure}): ${error.message}`);
  }

  try {
    return await transporter.sendMail({
      from: `"MACROC TEAM" <${smtpUser}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    throw new Error(`SMTP send failed (${smtpHost}:${smtpPort}, secure=${smtpSecure}): ${error.message}`);
  }
};

module.exports = async (to, otp, subject = "MACROC TEAM - OTP Verification") => {
  const html = buildHtml(otp);

  if (provider === "resend") {
    return sendWithResend({ to, subject, html });
  }

  return sendWithSmtp({ to, subject, html });
};
