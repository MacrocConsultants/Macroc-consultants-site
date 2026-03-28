"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../utils/api";
import { Download, FileText, Image as ImageIcon, Plus, Save, Search, Trash2, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

type ComplianceRecord = {
  _id?: string;
  month: string;
  year: number;
  sales: number;
  purchase: number;
  itc: {
    igst: { openingBalance: number; credits: number; debits: number; closingBalance: number };
    cgst: { openingBalance: number; credits: number; debits: number; closingBalance: number };
    sgst: { openingBalance: number; credits: number; debits: number; closingBalance: number };
  };
  gstr1FiledOn: string;
  gstr3bFiledOn: string;
};

type ClientRecord = {
  _id: string;
  companyName: string;
  name: string;
  services: string[];
  status: string;
  clientDocumentsFolderLink?: string;
  clientSharedFolderLink?: string;
  complianceRecords?: ComplianceRecord[];
  documents?: {
    _id: string;
    fileName: string;
    uploadedAt: string;
  }[];
  partnerDocuments?: {
    _id: string;
    fileName: string;
    uploadedAt: string;
  }[];
  clientSharedDocuments?: {
    _id: string;
    fileName: string;
    uploadedAt: string;
  }[];
};

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const taxTypes = ["sgst", "cgst", "igst"] as const;

const createEmptyRecord = (): ComplianceRecord => ({
  month: monthOptions[new Date().getMonth()],
  year: new Date().getFullYear(),
  sales: 0,
  purchase: 0,
  itc: {
    igst: { openingBalance: 0, credits: 0, debits: 0, closingBalance: 0 },
    cgst: { openingBalance: 0, credits: 0, debits: 0, closingBalance: 0 },
    sgst: { openingBalance: 0, credits: 0, debits: 0, closingBalance: 0 },
  },
  gstr1FiledOn: "",
  gstr3bFiledOn: "",
});

function sortComplianceRecords(records: ComplianceRecord[]) {
  return [...records].sort((a, b) => {
    const left = new Date(`${a.month} 1, ${a.year}`).getTime();
    const right = new Date(`${b.month} 1, ${b.year}`).getTime();
    return left - right;
  });
}

function buildItcLedgerRecords(records: ComplianceRecord[]) {
  const runningBalances = {
    sgst: 0,
    cgst: 0,
    igst: 0,
  };

  return sortComplianceRecords(records).map((record) => {
    const nextRecord: ComplianceRecord = {
      ...record,
      itc: {
        sgst: { ...record.itc.sgst },
        cgst: { ...record.itc.cgst },
        igst: { ...record.itc.igst },
      },
    };

    taxTypes.forEach((taxType) => {
      const openingBalance = Number(runningBalances[taxType] || 0);
      const credits = Number(nextRecord.itc[taxType].credits || 0);
      const debits = Number(nextRecord.itc[taxType].debits || 0);
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
}

export default function PartnerDashboard() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [clientDocumentsFolderLink, setClientDocumentsFolderLink] = useState("");
  const [clientSharedFolderLink, setClientSharedFolderLink] = useState("");
  const [complianceRecords, setComplianceRecords] = useState<ComplianceRecord[]>([]);
  const [savingPortalData, setSavingPortalData] = useState(false);
  const [savingLinkKey, setSavingLinkKey] = useState<"clientDocumentsFolderLink" | "clientSharedFolderLink" | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documentTab, setDocumentTab] = useState<"partner" | "client">("partner");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/clients");
      const data = res.data as ClientRecord[];
      setClients(data);

      if (!selectedClientId && data.length > 0) {
        setSelectedClientId(data[0]._id);
      }
    } catch {
      toast.error("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = useMemo(
    () =>
      clients.filter((client) =>
        client.companyName.toLowerCase().includes(search.toLowerCase())
      ),
    [clients, search]
  );

  const selectedClient =
    filteredClients.find((client) => client._id === selectedClientId) ||
    clients.find((client) => client._id === selectedClientId) ||
    null;

  useEffect(() => {
    if (!selectedClient) return;

    setClientDocumentsFolderLink(selectedClient.clientDocumentsFolderLink || "");
    setClientSharedFolderLink(selectedClient.clientSharedFolderLink || "");
    setComplianceRecords(
      buildItcLedgerRecords((selectedClient.complianceRecords || []).map((record) => ({
        ...record,
        purchase: Number(record.purchase || 0),
        itc: {
          igst: {
            openingBalance: Number(record.itc?.igst?.openingBalance || 0),
            credits: Number(record.itc?.igst?.credits || 0),
            debits: Number(record.itc?.igst?.debits || 0),
            closingBalance: Number(record.itc?.igst?.closingBalance || 0),
          },
          cgst: {
            openingBalance: Number(record.itc?.cgst?.openingBalance || 0),
            credits: Number(record.itc?.cgst?.credits || 0),
            debits: Number(record.itc?.cgst?.debits || 0),
            closingBalance: Number(record.itc?.cgst?.closingBalance || 0),
          },
          sgst: {
            openingBalance: Number(record.itc?.sgst?.openingBalance || 0),
            credits: Number(record.itc?.sgst?.credits || 0),
            debits: Number(record.itc?.sgst?.debits || 0),
            closingBalance: Number(record.itc?.sgst?.closingBalance || 0),
          },
        },
        gstr1FiledOn: record.gstr1FiledOn ? record.gstr1FiledOn.slice(0, 10) : "",
        gstr3bFiledOn: record.gstr3bFiledOn ? record.gstr3bFiledOn.slice(0, 10) : "",
      })))
    );
  }, [selectedClientId, selectedClient]);

  const handleComplianceChange = <K extends keyof ComplianceRecord>(
    index: number,
    key: K,
    value: ComplianceRecord[K]
  ) => {
    setComplianceRecords((current) =>
      buildItcLedgerRecords(
        current.map((record, recordIndex) =>
          recordIndex === index ? { ...record, [key]: value } : record
        )
      )
    );
  };

  const handleItcChange = (
    index: number,
    taxType: "igst" | "cgst" | "sgst",
    key: "credits" | "debits",
    value: number
  ) => {
    setComplianceRecords((current) =>
      buildItcLedgerRecords(
        current.map((record, recordIndex) =>
          recordIndex === index
            ? {
                ...record,
                itc: {
                  ...record.itc,
                  [taxType]: {
                    ...record.itc[taxType],
                    [key]: value,
                  },
                },
              }
            : record
        )
      )
    );
  };

  const addComplianceRecord = () => {
    setComplianceRecords((current) => buildItcLedgerRecords([...current, createEmptyRecord()]));
  };

  const removeComplianceRecord = (index: number) => {
    setComplianceRecords((current) =>
      buildItcLedgerRecords(current.filter((_, recordIndex) => recordIndex !== index))
    );
  };

  const savePortalData = async () => {
    if (!selectedClient) return;

    setSavingPortalData(true);
    try {
      const payload = {
        clientDocumentsFolderLink,
        clientSharedFolderLink,
        complianceRecords: buildItcLedgerRecords(complianceRecords).map((record) => ({
          ...record,
          sales: Number(record.sales || 0),
          purchase: Number(record.purchase || 0),
          itc: {
            igst: {
              credits: Number(record.itc.igst.credits || 0),
              debits: Number(record.itc.igst.debits || 0),
            },
            cgst: {
              credits: Number(record.itc.cgst.credits || 0),
              debits: Number(record.itc.cgst.debits || 0),
            },
            sgst: {
              credits: Number(record.itc.sgst.credits || 0),
              debits: Number(record.itc.sgst.debits || 0),
            },
          },
          gstr1FiledOn: record.gstr1FiledOn || null,
          gstr3bFiledOn: record.gstr3bFiledOn || null,
        })),
      };

      const res = await api.put(`/clients/${selectedClient._id}/portal-data`, payload);
      const updatedClient = res.data as ClientRecord;

      setClients((current) =>
        current.map((client) => (client._id === updatedClient._id ? updatedClient : client))
      );
      toast.success("Client portal data saved");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save client portal data");
    } finally {
      setSavingPortalData(false);
    }
  };

  const isValidSpacebyteLink = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return false;

    try {
      const url = new URL(trimmed);
      return (
        url.hostname.toLowerCase().includes("spacebyte.in") &&
        (/\/entries\/\d+/i.test(url.pathname) || /\d+/.test(url.pathname))
      );
    } catch {
      return false;
    }
  };

  const checkLink = (label: string, value: string) => {
    if (!value.trim()) {
      toast.error(`${label} is empty`);
      return false;
    }

    if (!isValidSpacebyteLink(value)) {
      toast.error(`${label} is not a valid Spacebyte folder link`);
      return false;
    }

    toast.success(`${label} looks valid`);
    return true;
  };

  const saveSingleLink = async (
    key: "clientDocumentsFolderLink" | "clientSharedFolderLink",
    label: string
  ) => {
    if (!selectedClient) return;

    const valueMap = {
      clientDocumentsFolderLink,
      clientSharedFolderLink,
    };

    const linkValue = valueMap[key];
    if (!checkLink(label, linkValue)) return;

    setSavingLinkKey(key);
    try {
      const payload = {
        clientDocumentsFolderLink,
        clientSharedFolderLink,
        complianceRecords: buildItcLedgerRecords(complianceRecords).map((record) => ({
          ...record,
          sales: Number(record.sales || 0),
          purchase: Number(record.purchase || 0),
          itc: {
            igst: {
              credits: Number(record.itc.igst.credits || 0),
              debits: Number(record.itc.igst.debits || 0),
            },
            cgst: {
              credits: Number(record.itc.cgst.credits || 0),
              debits: Number(record.itc.cgst.debits || 0),
            },
            sgst: {
              credits: Number(record.itc.sgst.credits || 0),
              debits: Number(record.itc.sgst.debits || 0),
            },
          },
          gstr1FiledOn: record.gstr1FiledOn || null,
          gstr3bFiledOn: record.gstr3bFiledOn || null,
        })),
      };

      const res = await api.put(`/clients/${selectedClient._id}/portal-data`, payload);
      const updatedClient = res.data as ClientRecord;
      setClients((current) =>
        current.map((client) => (client._id === updatedClient._id ? updatedClient : client))
      );
      toast.success(`${label} saved`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || `Failed to save ${label}`);
    } finally {
      setSavingLinkKey(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedClient) return;
    if (documentTab === "partner" && !clientDocumentsFolderLink.trim()) {
      toast.error("Save the client data by partner folder link before uploading.");
      return;
    }
    if (documentTab === "client" && !clientSharedFolderLink.trim()) {
      toast.error("Save the client doc by client folder link before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", documentTab);

    setUploading(true);
    try {
      await api.post(`/clients/${selectedClient._id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Document uploaded successfully");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await fetchClients();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const partnerDocuments = selectedClient?.partnerDocuments?.length
    ? selectedClient.partnerDocuments
    : selectedClient?.documents || [];
  const clientSharedDocuments = selectedClient?.clientSharedDocuments || [];
  const visibleDocuments = documentTab === "partner" ? partnerDocuments : clientSharedDocuments;

  const handleDownload = async (docId: string, fileName: string) => {
    if (!selectedClient) return;

    try {
      const response = await api.get(`/clients/${selectedClient._id}/documents/${docId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  const handleDelete = async (docId: string) => {
    if (!selectedClient) return;
    if (!confirm("Delete this document?")) return;

    try {
      await api.delete(`/clients/${selectedClient._id}/documents/${docId}`);
      toast.success("Document deleted");
      await fetchClients();
    } catch {
      toast.error("Delete failed");
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith(".pdf")) return <FileText className="text-red-500" size={18} />;
    if (fileName.match(/\.(jpg|jpeg|png)$/i)) return <ImageIcon className="text-blue-500" size={18} />;
    return <FileText className="text-slate-400" size={18} />;
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Search size={18} className="text-slate-400" />
          <input
            placeholder="Search assigned clients..."
            className="w-full bg-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px,minmax(0,1fr)] xl:grid-cols-[360px,minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-800">Assigned Clients</h2>
            <p className="mt-1 text-sm text-slate-500">Select a client to manage folder links, GST filing dates, sales data, and documents.</p>
          </div>

          <div className="max-h-[72vh] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-sm text-slate-500">Loading clients...</div>
            ) : filteredClients.length === 0 ? (
              <div className="p-6 text-sm text-slate-500">No assigned clients found.</div>
            ) : (
              filteredClients.map((client) => {
                const active = client._id === selectedClientId;
                return (
                  <button
                    key={client._id}
                    type="button"
                    onClick={() => setSelectedClientId(client._id)}
                    className={`w-full border-b border-slate-100 px-5 py-4 text-left transition ${
                      active ? "bg-blue-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-800">{client.companyName}</p>
                        <p className="mt-1 text-sm text-slate-500">{client.name}</p>
                        <p className="mt-2 text-xs text-slate-400">
                          {client.services?.length ? client.services.join(", ") : "No services assigned"}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-600">
                        {client.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          {!selectedClient ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
              Select a client to manage their portal data.
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">{selectedClient.companyName}</h1>
                    <p className="mt-1 text-sm text-slate-500">
                      Partner-controlled portal data for this client. What you save here is what the client will see.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={savePortalData}
                    disabled={savingPortalData}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Save size={16} />
                    {savingPortalData ? "Saving..." : "Save Portal Data"}
                  </button>
                </div>
              </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-800">Client Folder Link</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Paste the folder link the client can access from their dashboard for files shared by the partner.
                  </p>
                <div className="mt-4 flex flex-col gap-3 md:flex-row">
                  <input
                    value={clientDocumentsFolderLink}
                    onChange={(e) => setClientDocumentsFolderLink(e.target.value)}
                    placeholder="https://.../entries/123456"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                        onClick={() => checkLink("Client Folder Link", clientDocumentsFolderLink)}
                      className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Check
                    </button>
                    <button
                      type="button"
                        onClick={() => saveSingleLink("clientDocumentsFolderLink", "Client Folder Link")}
                      disabled={savingLinkKey === "clientDocumentsFolderLink"}
                      className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {savingLinkKey === "clientDocumentsFolderLink" ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-800">Client To Partner Folder Link</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Paste the separate folder link where the respective client uploads documents for the partner to review.
                  </p>
                <div className="mt-4 flex flex-col gap-3 md:flex-row">
                  <input
                    value={clientSharedFolderLink}
                    onChange={(e) => setClientSharedFolderLink(e.target.value)}
                    placeholder="https://.../entries/123456"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                        onClick={() => checkLink("Client To Partner Folder Link", clientSharedFolderLink)}
                      className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Check
                    </button>
                    <button
                      type="button"
                        onClick={() => saveSingleLink("clientSharedFolderLink", "Client To Partner Folder Link")}
                      disabled={savingLinkKey === "clientSharedFolderLink"}
                      className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {savingLinkKey === "clientSharedFolderLink" ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Monthly Sales, Purchase And GST Filing Sheet</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Use this like a lightweight Excel sheet. Add sales, purchase, filing dates, and ITC balances for IGST, CGST, and SGST.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addComplianceRecord}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <Plus size={16} />
                    Add Month
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {complianceRecords.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                      No month-wise GST, sales, purchase, or ITC data added yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="min-w-full">
                        <thead className="bg-slate-50">
                          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <th className="px-4 py-3">Month</th>
                            <th className="px-4 py-3">Year</th>
                            <th className="px-4 py-3">Sales</th>
                            <th className="px-4 py-3">Purchase</th>
                            <th className="px-4 py-3">GSTR-1 Filing</th>
                            <th className="px-4 py-3">GSTR-3B Filing</th>
                            <th className="px-4 py-3 text-center">Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {complianceRecords.map((record, index) => (
                            <tr key={`${record.month}-${record.year}-${index}`} className="border-t border-slate-100 bg-white">
                              <td className="px-4 py-3">
                                <select
                                  value={record.month}
                                  onChange={(e) => handleComplianceChange(index, "month", e.target.value)}
                                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {monthOptions.map((month) => (
                                    <option key={month} value={month}>
                                      {month}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={record.year}
                                  onChange={(e) => handleComplianceChange(index, "year", Number(e.target.value))}
                                  className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Year"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={record.sales}
                                  onChange={(e) => handleComplianceChange(index, "sales", Number(e.target.value))}
                                  className="w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Sales"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={record.purchase}
                                  onChange={(e) => handleComplianceChange(index, "purchase", Number(e.target.value))}
                                  className="w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Purchase"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="date"
                                  value={record.gstr1FiledOn || ""}
                                  onChange={(e) => handleComplianceChange(index, "gstr1FiledOn", e.target.value)}
                                  className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="date"
                                  value={record.gstr3bFiledOn || ""}
                                  onChange={(e) => handleComplianceChange(index, "gstr3bFiledOn", e.target.value)}
                                  className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeComplianceRecord(index)}
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                                  title="Remove month"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {complianceRecords.length > 0 && (
                  <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                    <table className="min-w-[1280px] w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
                          <th rowSpan={2} className="border-b border-slate-700 px-4 py-4 text-left">Month</th>
                          <th colSpan={3} className="border-b border-l border-slate-700 px-4 py-4 text-center text-emerald-300">Opening Bal</th>
                          <th colSpan={3} className="border-b border-l border-slate-700 px-4 py-4 text-center text-amber-300">Debits (Asset)</th>
                          <th colSpan={3} className="border-b border-l border-slate-700 px-4 py-4 text-center text-cyan-300">Credits (Liability)</th>
                          <th colSpan={3} className="border-b border-l border-slate-700 px-4 py-4 text-center text-fuchsia-300">Closing Bal</th>
                        </tr>
                        <tr className="bg-slate-800 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                          {["SGST", "CGST", "IGST", "SGST", "CGST", "IGST", "SGST", "CGST", "IGST", "SGST", "CGST", "IGST"].map((label, index) => (
                            <th
                              key={`itc-head-${label}-${index}`}
                              className={`border-b border-slate-700 px-3 py-3 text-center ${index % 3 === 0 ? "border-l" : ""}`}
                            >
                              {label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {complianceRecords.map((record, index) => (
                          <tr key={`itc-ledger-${record.month}-${record.year}-${index}`} className="border-t border-slate-100 bg-white align-top">
                            <td className="px-4 py-4 font-semibold text-slate-800 whitespace-nowrap">
                              {record.month.slice(0, 3)}-{String(record.year).slice(-2)}
                            </td>
                            {taxTypes.map((taxType, taxIndex) => (
                              <td key={`${record.month}-${taxType}-opening`} className={`px-3 py-3 ${taxIndex === 0 ? "border-l border-slate-200" : ""}`}>
                                <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                                  {record.itc[taxType].openingBalance.toLocaleString()}
                                </div>
                              </td>
                            ))}
                            {taxTypes.map((taxType, taxIndex) => (
                              <td key={`${record.month}-${taxType}-debit`} className={`px-3 py-3 ${taxIndex === 0 ? "border-l border-slate-200" : ""}`}>
                                <input
                                  type="number"
                                  min="0"
                                  value={record.itc[taxType].debits}
                                  onChange={(e) => handleItcChange(index, taxType, "debits", Number(e.target.value))}
                                  className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                              </td>
                            ))}
                            {taxTypes.map((taxType, taxIndex) => (
                              <td key={`${record.month}-${taxType}-credit`} className={`px-3 py-3 ${taxIndex === 0 ? "border-l border-slate-200" : ""}`}>
                                <input
                                  type="number"
                                  min="0"
                                  value={record.itc[taxType].credits}
                                  onChange={(e) => handleItcChange(index, taxType, "credits", Number(e.target.value))}
                                  className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                />
                              </td>
                            ))}
                            {taxTypes.map((taxType, taxIndex) => (
                              <td key={`${record.month}-${taxType}-closing`} className={`px-3 py-3 ${taxIndex === 0 ? "border-l border-slate-200" : ""}`}>
                                <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                                  {record.itc[taxType].closingBalance.toLocaleString()}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800">Client Documents</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage separate document channels for partner-uploaded files and client-uploaded files.
                </p>

                <div className="mt-6 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setDocumentTab("partner")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      documentTab === "partner" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
                    }`}
                  >
                    Client Data By Partner
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocumentTab("client")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      documentTab === "client" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
                    }`}
                  >
                    Client Doc By Client
                  </button>
                </div>

                <form onSubmit={handleUpload} className="mt-6 rounded-xl border border-dashed border-slate-300 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-100 p-3 text-slate-500">
                        <UploadCloud size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{file ? file.name : "Choose document to upload"}</p>
                        <p className="text-sm text-slate-500">
                          {documentTab === "partner"
                            ? "Upload into Client Data By Partner. Supported: PDF, Excel, Word, text, JSON, images, and other common files up to 25MB"
                            : "This tab shows files uploaded by the client into Client Doc By Client."}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Browse File
                      </button>
                      <button
                        type="submit"
                        disabled={!file || uploading || documentTab !== "partner"}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </button>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </form>

                <div className="mt-6 space-y-3">
                  {!visibleDocuments.length ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                      {documentTab === "partner"
                        ? "No partner-uploaded files yet."
                        : "No client-uploaded files yet."}
                    </div>
                  ) : (
                    visibleDocuments.map((doc) => (
                      <div key={doc._id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="rounded-lg bg-slate-50 p-2">{getFileIcon(doc.fileName)}</div>
                          <div className="overflow-hidden">
                            <p className="truncate font-medium text-slate-800">{doc.fileName}</p>
                            <p className="text-xs text-slate-500">
                              Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownload(doc._id, doc.fileName)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                            title="Download"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(doc._id)}
                            disabled={documentTab !== "partner"}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
