const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    mobileNumber: { type: String, trim: true },

    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      match: /^[0-9A-Z]{15}$/,
    },

    state: { type: String, trim: true },

    city: { type: String, trim: true },

    otherCategory: { type: String, trim: true },

    partnerSpacebyteFolderLink: { type: String, trim: true, default: "" },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["super-admin", "admin", "partner", "client"],
      required: true,
    },

    // 🔥 Optional business info
    businessName: { type: String },

    // 🔥 Services selected by client
    services: [{ type: String }],

    // 🔥 Partner → assigned clients
    assignedClients: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    ],

    // ================= OTP (REGISTRATION) =================
    otp: { type: String },
    otpExpiry: { type: Date },

    // ================= OTP (FORGOT PASSWORD) =================
    resetOtp: { type: String },
    resetOtpExpiry: { type: Date },

    // ================= VERIFICATION =================
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔐 Password hash
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// 🔐 Password compare
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
