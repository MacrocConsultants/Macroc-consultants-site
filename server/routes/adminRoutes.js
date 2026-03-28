const express = require("express");
const router = express.Router();
const { assignClient } = require("../../controllers/adminController");

router.post("/assign", assignClient);

module.exports = router;