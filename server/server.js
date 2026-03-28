require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const contentRoutes = require("./routes/contentRoutes");
const clientRoutes = require("./routes/clientRoutes");
const userRoutes = require("./routes/userRoutes");

const { protect, authorize } = require("./middleware/authMiddleware");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// ================= CORS =================
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// ================= ROUTES =================

// Auth
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

// Public CMS
app.get(
  "/api/content/:id",
  require("./controllers/contentController").getContent
);

// Protected Routes
app.use("/api/content", protect, authorize("admin"), contentRoutes);
app.use("/api/clients", protect, clientRoutes);
app.use("/api/users", protect, authorize("admin"), userRoutes);

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= SERVER START =================
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully");
    console.log("Connected DB Name:", mongoose.connection.name);
    console.log("Full Mongo URI:", mongoUri);

    // ================= ADMIN SEED =================
    const User = require("./models/User");
    const legacyAdminEmail = "admin@bod.com";
    const superAdminEmail = "macroc.consultants@zohomail.in";

    let admin = await User.findOne({ email: superAdminEmail });

    if (!admin) {
      const legacyAdmin = await User.findOne({ email: legacyAdminEmail });

      if (legacyAdmin) {
        legacyAdmin.email = superAdminEmail;
        legacyAdmin.role = "super-admin";
        legacyAdmin.isVerified = true;
        await legacyAdmin.save();
        admin = legacyAdmin;
      }
    }

    if (!admin) {
      await User.create({
        name: "Super Admin",
        email: superAdminEmail,
        password: "password123",
        role: "super-admin",
        isVerified: true,
      });

      console.log("Default Admin Created:");
      console.log(`Email: ${superAdminEmail}`);
      console.log("Password: password123");
    } else if (admin.role !== "super-admin" || !admin.isVerified) {
      admin.role = "super-admin";
      admin.isVerified = true;
      await admin.save();
    }

    // ================= START SERVER =================
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
