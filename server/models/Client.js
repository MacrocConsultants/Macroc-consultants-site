const mongoose = require("mongoose");

const MonthlyComplianceSchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    year: { type: Number, required: true },
    sales: { type: Number, default: 0 },
    purchase: { type: Number, default: 0 },
    itc: {
      igst: {
        openingBalance: { type: Number, default: 0 },
        credits: { type: Number, default: 0 },
        debits: { type: Number, default: 0 },
        closingBalance: { type: Number, default: 0 },
      },
      cgst: {
        openingBalance: { type: Number, default: 0 },
        credits: { type: Number, default: 0 },
        debits: { type: Number, default: 0 },
        closingBalance: { type: Number, default: 0 },
      },
      sgst: {
        openingBalance: { type: Number, default: 0 },
        credits: { type: Number, default: 0 },
        debits: { type: Number, default: 0 },
        closingBalance: { type: Number, default: 0 },
      },
    },
    gstr1FiledOn: { type: Date, default: null },
    gstr3bFiledOn: { type: Date, default: null },
  },
  { _id: true }
);

const ClientDocumentSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileId: { type: String, required: true },
    spacebytePath: { type: String, default: "" },
    spacebyteParentId: { type: String, default: "" },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { _id: true }
);

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    companyName: { type: String, required: true },

    // 🔥 Link to client user account
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔥 Assigned partner (important for filtering)
    assignedPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    services: [{ type: String }],

    status: {
      type: String,
      enum: ["active", "pending", "completed"],
      default: "pending",
    },

    spacebyteFolderLink: {
      type: String,
      default: "",
    },

    clientDocumentsFolderLink: {
      type: String,
      default: "",
    },

    clientSharedFolderLink: {
      type: String,
      default: "",
    },

    complianceRecords: [MonthlyComplianceSchema],

    documents: [ClientDocumentSchema],
    partnerDocuments: [ClientDocumentSchema],
    clientSharedDocuments: [ClientDocumentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);
