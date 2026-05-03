const express = require("express");
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} = require("../controllers/contactController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", submitContactMessage);
router.get("/", protect, authorize("admin"), getContactMessages);
router.put("/:id", protect, authorize("admin"), updateContactMessageStatus);
router.delete("/:id", protect, authorize("admin"), deleteContactMessage);

module.exports = router;
