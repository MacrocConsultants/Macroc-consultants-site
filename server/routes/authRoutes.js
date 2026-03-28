const express = require("express");
const router = express.Router();

const {
  login,
  register,
  verifyOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword
} = require("../controllers/authController");

// AUTH
router.post("/login", login);
router.post("/register", register);
router.post("/verify-otp", verifyOtp);

// 🔥 FIXED ROUTES
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;