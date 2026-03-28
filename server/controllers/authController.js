const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

// 🔐 Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "30d" }
  );
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    console.log("🔍 LOGIN USER:", user?.email);
    console.log("ROLE:", user?.role);
    console.log("isVerified:", user?.isVerified);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔥 FIXED: handle string/boolean mismatch
    if (user.role === "client" && user.isVerified !== true) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "client",
      partnerSpacebyteFolderLink: user.partnerSpacebyteFolderLink || "",
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};


// ================= REGISTER =================
exports.register = async (req, res) => {
  const {
    name,
    email,
    password,
    mobileNumber,
    state,
    city,
    otherCategory,
    businessName,
    services,
  } = req.body;

  try {
    console.log("🔵 REGISTER HIT:", email);

    if (!name || !email || !password || !mobileNumber || !state || !city) {
      return res.status(400).json({
        message: "Name, email, mobile number, state, city, and password are required",
      });
    }

    if (Array.isArray(services) && services.includes("Other") && !otherCategory) {
      return res.status(400).json({
        message: "Other category is required when Other is selected",
      });
    }

    const otp = generateOtp();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    let user = await User.findOne({ email });

    if (user) {
      console.log("🟡 Existing user");

      user.otp = String(otp);
      user.otpExpiry = otpExpiry;
      user.isVerified = false;
      user.mobileNumber = mobileNumber;
      user.state = state;
      user.city = city;
      user.otherCategory = otherCategory;

      if (businessName) user.businessName = businessName;
      if (services) user.services = services;

      await user.save();

    } else {
      console.log("🟢 New user");

      user = await User.create({
        name,
        email,
        mobileNumber,
        state,
        city,
        otherCategory,
        password,
        role: "client",
        businessName,
        services: services || [],
        otp: String(otp),
        otpExpiry,
        isVerified: false,
      });
    }

    console.log("🟢 OTP:", otp);

    try {
      await sendEmail(email, otp);
      console.log("✅ EMAIL SENT");
    } catch (err) {
      console.error("❌ EMAIL ERROR:", err.message);
    }

    res.status(200).json({
      message: "OTP sent successfully",
      email,
    });

  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};


// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user.otp !== String(otp) ||
      !user.otpExpiry ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Account verified successfully" });

  } catch (error) {
    console.error("❌ VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};


// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    console.log("🔵 FORGOT PASSWORD:", email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();

    user.resetOtp = String(otp);
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log("🟢 RESET OTP:", otp);

    try {
      await sendEmail(email, otp);
      console.log("✅ RESET EMAIL SENT");
    } catch (err) {
      console.error("❌ EMAIL ERROR:", err.message);
    }

    return res.status(200).json({
      message: "OTP sent successfully",
      email,
    });

  } catch (error) {
    console.error("❌ FORGOT ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ================= VERIFY RESET OTP =================
exports.verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    console.log("DB OTP:", user?.resetOtp);
    console.log("ENTERED OTP:", otp);
    console.log("EXPIRY:", user?.resetOtpExpiry);
    console.log("NOW:", Date.now());

    if (
      !user ||
      String(user.resetOtp) !== String(otp) ||
      !user.resetOtpExpiry ||
      user.resetOtpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    return res.json({ message: "OTP verified" });

  } catch (error) {
    console.error("VERIFY RESET OTP ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      String(user.resetOtp) !== String(otp) ||
      !user.resetOtpExpiry ||
      user.resetOtpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.resetOtp = null;
    user.resetOtpExpiry = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error("❌ RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};
