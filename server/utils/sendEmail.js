const nodemailer = require("nodemailer");

// 🔥 ZOHO SMTP CONFIG (Production Ready)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.zoho.in", // ✅ fallback safe
  port: process.env.EMAIL_PORT || 465,
  secure: true, // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // 🔥 helps avoid SSL issues in some envs
  },
});

// 🔍 VERIFY CONNECTION (runs once on startup)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ EMAIL CONFIG ERROR:", error.message);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

module.exports = async (to, otp) => {
  try {
    console.log("📧 Sending OTP to:", to);
    console.log("📨 Using EMAIL_USER:", process.env.EMAIL_USER);

    const mailOptions = {
      from: `"MACROC-TEAM" <${process.env.EMAIL_USER}>`,
      to,
      subject: "MACROC-TEAM - OTP Verification",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>🔐 OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="color:#2563eb; letter-spacing:2px;">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
          <br/>
          <small>If you didn't request this, ignore this email.</small>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.messageId);

  } catch (error) {
    console.error("❌ EMAIL SEND FAILED:", error.message);

    // 🔥 EXTRA DEBUG (VERY IMPORTANT)
    console.error("EMAIL USER:", process.env.EMAIL_USER);
    console.error("EMAIL HOST:", process.env.EMAIL_HOST || "smtp.zoho.in");

    // 🔥 FALLBACK (DO NOT BREAK FLOW)
    console.log("⚠️ FALLBACK → OTP (for testing):", otp);

    throw error; // keep this
  }
};
