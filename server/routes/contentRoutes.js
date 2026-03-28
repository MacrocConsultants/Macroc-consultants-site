const express = require("express");
const router = express.Router();
const { updateContent } = require("../controllers/contentController");

router.post("/:id", updateContent);
module.exports = router;
