const express = require("express");
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  updateContactMessageStatus,
} = require("../controllers/contactController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", submitContactMessage);
router.get("/", protect, authorize("admin"), getContactMessages);
router.put("/:id", protect, authorize("admin"), updateContactMessageStatus);

module.exports = router;
