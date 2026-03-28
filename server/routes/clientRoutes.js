const express = require("express");
const router = express.Router();
const {
  getClients,
  createClient,
  updateClient,
  updateClientPortalData,
  getClientDocuments,
  uploadDocument,
  downloadDocument,
  deleteDocument,
} = require("../controllers/clientController");
const { authorize } = require("../middleware/authMiddleware");
const { validateClientCreation } = require("../middleware/validationMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.route("/")
  .get(authorize("admin", "partner", "client"), getClients)
  .post(authorize("admin"), validateClientCreation, createClient);

router.route("/:id")
  .put(authorize("admin", "partner"), updateClient);

router.route("/:id/portal-data")
  .put(authorize("admin", "partner"), updateClientPortalData);

router.route("/:id/documents")
  .get(authorize("admin", "partner", "client"), getClientDocuments);

router.route("/:id/upload")
  .post(authorize("admin", "partner", "client"), upload.single("file"), uploadDocument);

router.route("/:id/documents/:docId")
  .get(authorize("admin", "partner", "client"), downloadDocument)
  .delete(authorize("admin", "partner"), deleteDocument);

module.exports = router;
