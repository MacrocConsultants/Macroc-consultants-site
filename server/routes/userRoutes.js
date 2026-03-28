const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ================= CREATE USER =================
// (Admin only)
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role, partnerSpacebyteFolderLink = "" } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      partnerSpacebyteFolderLink:
        role === "partner" && typeof partnerSpacebyteFolderLink === "string"
          ? partnerSpacebyteFolderLink.trim()
          : "",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      partnerSpacebyteFolderLink: user.partnerSpacebyteFolderLink || "",
    });

  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});


// ================= GET ALL USERS =================
// (Admin only)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      name,
      email,
      role,
      partnerSpacebyteFolderLink,
    } = req.body;

    if (typeof name === "string") user.name = name.trim();
    if (typeof email === "string") user.email = email.trim();
    if (typeof role === "string") user.role = role;

    user.partnerSpacebyteFolderLink =
      user.role === "partner" && typeof partnerSpacebyteFolderLink === "string"
        ? partnerSpacebyteFolderLink.trim()
        : "";

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      partnerSpacebyteFolderLink: user.partnerSpacebyteFolderLink || "",
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});


// ================= DELETE USER =================
// (Admin only)
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ Prevent deleting self
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot delete yourself",
      });
    }

    // ❌ Prevent deleting another admin (optional safety)
    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin cannot be deleted",
      });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});


module.exports = router;
