const Client = require("../models/Client");
const User = require("../models/User");
const { spacebyteFetch } = require("../services/spacebyteService");

const parseSpacebyteResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return { raw: text };
  }
};

const getSpacebytePublicBaseUrl = () =>
  (process.env.SPACEBYTE_BASE_URL || "").replace(/\/api\/v1\/?$/, "");

const extractSpacebyteFolderId = (folderLink = "") => {
  if (!folderLink || typeof folderLink !== "string") {
    return "";
  }

  const entriesMatch = folderLink.match(/entries\/(\d+)/i);
  if (entriesMatch?.[1]) {
    return entriesMatch[1];
  }

  const trailingNumberMatch = folderLink.match(/(\d+)(?!.*\d)/);
  return trailingNumberMatch?.[1] || "";
};

const getSpacebyteDocumentReference = (data = {}) => {
  const fileId =
    data.id ||
    data.fileId ||
    data.data?.id ||
    data.data?.fileId ||
    data.entry?.id ||
    data.file?.id ||
    data.path ||
    data.data?.path ||
    null;

  const path =
    data.path ||
    data.data?.path ||
    data.entry?.path ||
    data.file?.path ||
    "";

  const publicBaseUrl = getSpacebytePublicBaseUrl();

  const fileUrl =
    data.url ||
    data.fileUrl ||
    data.data?.url ||
    data.data?.fileUrl ||
    data.entry?.url ||
    data.file?.url ||
    (path && publicBaseUrl ? `${publicBaseUrl}/${path.replace(/^\/+/, "")}` : "") ||
    (fileId ? `${process.env.SPACEBYTE_BASE_URL}/files/${fileId}` : "");

  return {
    fileId: fileId ? String(fileId) : null,
    fileUrl,
    path: path ? String(path) : "",
    parentId:
      data.parent != null
        ? String(data.parent)
        : data.parent_id != null
          ? String(data.parent_id)
          : data.data?.parent != null
            ? String(data.data.parent)
            : "",
  };
};

const sortComplianceRecords = (records = []) =>
  [...records].sort((a, b) => {
    const left = new Date(`${a.month} 1, ${a.year}`).getTime();
    const right = new Date(`${b.month} 1, ${b.year}`).getTime();
    return left - right;
  });

const taxTypes = ["igst", "cgst", "sgst"];

const buildItcLedgerRecords = (records = []) => {
  const runningBalances = {
    igst: 0,
    cgst: 0,
    sgst: 0,
  };

  return sortComplianceRecords(records).map((record) => {
    const nextRecord = {
      ...record,
      itc: {
        igst: { ...(record.itc?.igst || {}) },
        cgst: { ...(record.itc?.cgst || {}) },
        sgst: { ...(record.itc?.sgst || {}) },
      },
    };

    taxTypes.forEach((taxType) => {
      const openingBalance = Number(runningBalances[taxType] || 0);
      const credits = Number(nextRecord.itc[taxType]?.credits || 0);
      const debits = Number(nextRecord.itc[taxType]?.debits || 0);
      const closingBalance = openingBalance + debits - credits;

      nextRecord.itc[taxType] = {
        openingBalance,
        credits,
        debits,
        closingBalance,
      };

      runningBalances[taxType] = closingBalance;
    });

    return nextRecord;
  });
};

const getPartnerDocuments = (client) =>
  (client.partnerDocuments && client.partnerDocuments.length ? client.partnerDocuments : client.documents) || [];

const getClientSharedDocuments = (client) => client.clientSharedDocuments || [];

const getDocumentCollectionKey = (req, client) => {
  const requestedCategory = String(req.query.category || req.body?.category || "").trim().toLowerCase();

  if (requestedCategory === "client" || requestedCategory === "client-shared") {
    return "clientSharedDocuments";
  }

  if (requestedCategory === "partner" || requestedCategory === "partner-data") {
    return client.partnerDocuments?.length ? "partnerDocuments" : "documents";
  }

  if (req.user.role === "client") {
    return "clientSharedDocuments";
  }

  return client.partnerDocuments?.length ? "partnerDocuments" : "documents";
};

const getFolderLinkForCollection = (client, collectionKey, partner) => {
  if (collectionKey === "clientSharedDocuments") {
    return client.clientSharedFolderLink || "";
  }

  return (
    partner?.partnerSpacebyteFolderLink ||
    client.clientDocumentsFolderLink ||
    client.spacebyteFolderLink ||
    ""
  );
};

const ensureClientProfileForUser = async (user) => {
  if (!user || user.role !== "client") {
    return null;
  }

  let client = await Client.findOne({ clientId: user._id }).populate("assignedPartner", "name email");
  if (client) {
    return client;
  }

  const account = await User.findById(user._id).select("name businessName services");
  if (!account) {
    return null;
  }

  client = await Client.create({
    name: account.name,
    companyName: account.businessName?.trim() || account.name,
    clientId: account._id,
    services: Array.isArray(account.services) ? account.services : [],
    status: "pending",
  });

  return Client.findById(client._id).populate("assignedPartner", "name email");
};

exports.getClients = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "partner") {
      query = { assignedPartner: req.user._id };
    } else if (req.user.role === "client") {
      const client = await ensureClientProfileForUser(req.user);
      return res.json(client ? [client] : []);
    }
    const clients = await Client.find(query).populate("assignedPartner", "name email");
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // RBAC: Partner can only update assigned clients, and only their status.
    if (req.user.role === "partner") {
      if (client.assignedPartner?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden: Partner can only update assigned clients." });
      }
      
      const { status } = req.body;
      if (status) {
        client.status = status;
        await client.save();
        return res.json(client);
      } else {
         return res.status(400).json({ message: "Partners can only update the client status." });
      }
    }

    // Admin can update everything
    if (req.user.role === "admin") {
      const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(updatedClient);
    }

    return res.status(403).json({ message: "Forbidden: You are not authorized to perform this update." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getClientDocuments = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    if (req.user.role === "client" && client.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You can only view your own documents." });
    }
    if (req.user.role === "partner" && client.assignedPartner?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You can only view documents for assigned clients." });
    }

    res.json({
      partnerDocuments: getPartnerDocuments(client),
      clientSharedDocuments: getClientSharedDocuments(client),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      res.status(404);
      throw new Error("Client not found");
    }

    if (req.user.role === "client" && client.clientId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Forbidden: You can only upload your own documents.");
    }
    if (req.user.role === "partner" && client.assignedPartner?.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Forbidden: You can only upload documents for assigned clients.");
    }

    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded");
    }

    // Convert buffer to a blob for FormData
    const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
    const formData = new FormData();
    formData.append("file", fileBlob, req.file.originalname);
    formData.append("clientId", client._id.toString());

    const collectionKey = getDocumentCollectionKey(req, client);
    const assignedPartner =
      collectionKey === "clientSharedDocuments" || !client.assignedPartner
        ? null
        : await User.findById(client.assignedPartner).select("partnerSpacebyteFolderLink");
    const documentsFolderLink = getFolderLinkForCollection(client, collectionKey, assignedPartner);
    const targetFolderId = extractSpacebyteFolderId(documentsFolderLink);
    if (!targetFolderId) {
      res.status(400);
      throw new Error(
        collectionKey === "clientSharedDocuments"
          ? "Please save the client doc by client folder link before uploading."
          : "Please save either the client data by partner folder link or the partner Spacebyte folder before uploading documents."
      );
    }

    if (targetFolderId) {
      formData.append("parent", targetFolderId);
    }
    
    // Upload to Spacebyte
    const response = await spacebyteFetch("/uploads", {
      method: "POST",
      body: formData,
    });

    const data = await parseSpacebyteResponse(response);

    if (!response.ok) {
      res.status(response.status);
      throw new Error(
        `Spacebyte upload failed: ${
          data.message || data.error || data.raw || response.statusText || "Unknown upload error"
        }`
      );
    }
    
    const reference = getSpacebyteDocumentReference(data);

    const newDocument = {
      fileName: req.file.originalname,
      fileUrl:
        reference.fileUrl ||
        `${getSpacebytePublicBaseUrl()}/${reference.path.replace(/^\/+/, "")}`,
      fileId: reference.fileId || reference.path || req.file.originalname,
      spacebytePath: reference.path,
      spacebyteParentId: reference.parentId || targetFolderId,
      uploadedBy: req.user._id,
    };

    if (!client.partnerDocuments?.length && client.documents?.length) {
      client.partnerDocuments = [...client.documents];
      client.documents = [];
    }

    client[collectionKey].push(newDocument);
    await client.save();

    res.status(201).json({ message: "File uploaded securely", document: newDocument });
  } catch (error) {
    next(error);
  }
};

exports.downloadDocument = async (req, res, next) => {
  try {
    const { id, docId } = req.params;

    const client = await Client.findById(id);
    if (!client) {
      res.status(404);
      throw new Error("Client not found");
    }

    // Strict RBAC
    if (req.user.role === "client" && client.clientId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Forbidden: You can only access your own documents.");
    }
    if (req.user.role === "partner" && client.assignedPartner?.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Forbidden: You can only access documents for assigned clients.");
    }

    const document =
      getPartnerDocuments(client).id?.(docId) ||
      getClientSharedDocuments(client).id?.(docId) ||
      client.documents.id(docId);
    if (!document) {
      res.status(404);
      throw new Error("Document not found");
    }

    // Proxy the request to Spacebyte to hide the direct URL and enforce backend-only access
    // Extract relative path from absolute URL if needed, or assume fileUrl stores the path
    const endpoint = new URL(document.fileUrl).pathname;
    
    const response = await spacebyteFetch(endpoint, {
      method: "GET"
    });

    if (!response.ok) {
      res.status(response.status);
      throw new Error(`Failed to fetch file from Spacebyte: ${response.statusText}`);
    }

    res.setHeader("Content-Disposition", `attachment; filename="${document.fileName}"`);
    res.setHeader("Content-Type", response.headers.get("Content-Type") || "application/octet-stream");
    
    // Stream response to the client
    const { Readable } = require("stream");
    Readable.fromWeb(response.body).pipe(res);
    
  } catch (error) {
    next(error);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const { id, docId } = req.params;

    const client = await Client.findById(id);
    if (!client) {
      res.status(404);
      throw new Error("Client not found");
    }

    // Strict RBAC
    if (req.user.role === "client") {
      res.status(403);
      throw new Error("Forbidden: Clients cannot delete documents. Contact Admin or Partner.");
    }
    if (req.user.role === "partner" && client.assignedPartner?.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Forbidden: You can only delete documents for assigned clients.");
    }

    const partnerDocuments = getPartnerDocuments(client);
    const clientDocuments = getClientSharedDocuments(client);
    const document =
      partnerDocuments.id?.(docId) ||
      clientDocuments.id?.(docId) ||
      client.documents.id(docId);
    if (!document) {
      res.status(404);
      throw new Error("Document not found");
    }

    // Remove from Spacebyte
    const deleteResponse = await spacebyteFetch(`/files/${document.fileId}`, {
      method: "DELETE"
    });

    if (!deleteResponse.ok) {
       res.status(deleteResponse.status);
       throw new Error(`Failed to delete file from Spacebyte: ${deleteResponse.statusText}`);
    }

    // Remove from DB
    document.deleteOne();
    await client.save();

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.createClient = async (req, res) => {
  try {
    const existingClient = await Client.findOne({ clientId: req.body.clientId });
    if (existingClient) {
      return res.status(400).json({ message: "A client profile already exists for this user." });
    }

    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateClientPortalData = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (req.user.role === "partner" && client.assignedPartner?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You can only manage portal data for assigned clients." });
    }

    const {
      spacebyteFolderLink = "",
      clientDocumentsFolderLink = "",
      clientSharedFolderLink = "",
      complianceRecords = [],
    } = req.body;

    client.spacebyteFolderLink = typeof spacebyteFolderLink === "string" ? spacebyteFolderLink.trim() : "";
    client.clientDocumentsFolderLink =
      typeof clientDocumentsFolderLink === "string" ? clientDocumentsFolderLink.trim() : "";
    client.clientSharedFolderLink =
      typeof clientSharedFolderLink === "string" ? clientSharedFolderLink.trim() : "";
    client.complianceRecords = buildItcLedgerRecords(
      (Array.isArray(complianceRecords) ? complianceRecords : []).map((record) => ({
        month: record.month,
        year: Number(record.year),
        sales: Number(record.sales || 0),
        purchase: Number(record.purchase || 0),
        itc: {
          igst: {
            credits: Number(record.itc?.igst?.credits || 0),
            debits: Number(record.itc?.igst?.debits || 0),
          },
          cgst: {
            credits: Number(record.itc?.cgst?.credits || 0),
            debits: Number(record.itc?.cgst?.debits || 0),
          },
          sgst: {
            credits: Number(record.itc?.sgst?.credits || 0),
            debits: Number(record.itc?.sgst?.debits || 0),
          },
        },
        gstr1FiledOn: record.gstr1FiledOn || null,
        gstr3bFiledOn: record.gstr3bFiledOn || null,
      }))
    );

    await client.save();

    const updatedClient = await Client.findById(client._id).populate("assignedPartner", "name email");
    res.json(updatedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
