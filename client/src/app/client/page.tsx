"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../utils/api";
import { Download, ExternalLink, FileText, Image as ImageIcon, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

type ComplianceRecord = {
  _id?: string;
  month: string;
  year: number;
  sales: number;
  purchase?: number;
  itc?: {
    sgst?: { openingBalance?: number; debits?: number; credits?: number; closingBalance?: number };
    cgst?: { openingBalance?: number; debits?: number; credits?: number; closingBalance?: number };
    igst?: { openingBalance?: number; debits?: number; credits?: number; closingBalance?: number };
  };
  gstr1FiledOn?: string | null;
  gstr3bFiledOn?: string | null;
};

const taxTypes = ["sgst", "cgst", "igst"] as const;

type ClientInfo = {
  _id: string;
  name: string;
  companyName: string;
  status: string;
  services: string[];
  assignedPartner?: { name: string; email: string };
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

function formatDate(value?: string | null) {
  if (!value) return "Not filed yet";
  return new Date(value).toLocaleDateString();
}

export default function ClientDashboard() {
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documentTab, setDocumentTab] = useState<"partner" | "client">("partner");
  const [chartView, setChartView] = useState<"normal" | "bar" | "line">("bar");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchClient = async () => {
    const res = await api.get("/clients");
    setClientInfo(res.data[0] || null);
  };

  useEffect(() => {
    fetchClient().catch(() => toast.error("Failed to load your dashboard data"));
  }, []);

  const salesRecords = useMemo(() => {
    const records = [...(clientInfo?.complianceRecords || [])];
    return records.sort((a, b) => {
      const left = new Date(`${a.month} 1, ${a.year}`).getTime();
      const right = new Date(`${b.month} 1, ${b.year}`).getTime();
      return left - right;
    });
  }, [clientInfo]);

  const chartMaxValue = useMemo(
    () =>
      Math.max(
        ...salesRecords.flatMap((record) => [Number(record.sales || 0), Number(record.purchase || 0)]),
        1
      ),
    [salesRecords]
  );

  const salesLinePoints = useMemo(() => {
    if (salesRecords.length <= 1) return "";

    return salesRecords
      .map((record, index) => {
        const x = (index / (salesRecords.length - 1)) * 100;
        const y = 100 - (Number(record.sales || 0) / chartMaxValue) * 100;
        return `${x},${y}`;
      })
      .join(" ");
  }, [chartMaxValue, salesRecords]);

  const purchaseLinePoints = useMemo(() => {
    if (salesRecords.length <= 1) return "";

    return salesRecords
      .map((record, index) => {
        const x = (index / (salesRecords.length - 1)) * 100;
        const y = 100 - (Number(record.purchase || 0) / chartMaxValue) * 100;
        return `${x},${y}`;
      })
      .join(" ");
  }, [chartMaxValue, salesRecords]);

  const handleDownload = async (docId: string, fileName: string) => {
    if (!clientInfo) return;

    try {
      const response = await api.get(`/clients/${clientInfo._id}/documents/${docId}`, {
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
      toast.error("Failed to download document");
    }
  };

  const handleView = async (docId: string, fileName: string) => {
    if (!clientInfo) return;

    try {
      const response = await api.get(`/clients/${clientInfo._id}/documents/${docId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } catch {
      toast.error("Failed to open document");
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith(".pdf")) return <FileText className="text-red-500" size={20} />;
    if (fileName.match(/\.(jpg|jpeg|png)$/i)) return <ImageIcon className="text-blue-500" size={20} />;
    return <FileText className="text-slate-400" size={20} />;
  };

  const handleClientUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientInfo || !file) return;
    if (!clientInfo.clientSharedFolderLink) {
      toast.error("Partner has not shared the client upload folder yet.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "client");

    setUploading(true);
    try {
      await api.post(`/clients/${clientInfo._id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded successfully");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await fetchClient();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const partnerDocuments = clientInfo?.partnerDocuments?.length
    ? clientInfo.partnerDocuments
    : clientInfo?.documents || [];
  const clientSharedDocuments = clientInfo?.clientSharedDocuments || [];
  const visibleDocuments = documentTab === "partner" ? partnerDocuments : clientSharedDocuments;

  if (!clientInfo) {
    return <div className="flex h-full items-center justify-center text-slate-500">Loading portal...</div>;
  }

  return (
    <div className="w-full min-w-0 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">Welcome, {clientInfo.name}</h1>
        <p className="mt-1 text-slate-500">
          Your partner-managed portal shows current GST filing dates, month-wise sales, and your document vault.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Company</p>
          <p className="mt-3 text-lg font-semibold text-slate-800">{clientInfo.companyName}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Status</p>
          <p className="mt-3 text-lg font-semibold capitalize text-slate-800">{clientInfo.status}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Assigned Partner</p>
          <p className="mt-3 text-lg font-semibold text-slate-800">{clientInfo.assignedPartner?.name || "Pending Assignment"}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active Services</p>
          <p className="mt-3 text-lg font-semibold text-slate-800">{clientInfo.services?.length || 0}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Spacebyte Folder Access</h2>
            <p className="mt-1 text-sm text-slate-500">
              This folder link is shared by your partner so you can directly access the client folder from your dashboard.
            </p>
          </div>

          {clientInfo.clientDocumentsFolderLink ? (
            <a
              href={clientInfo.clientDocumentsFolderLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <ExternalLink size={16} />
              Open Spacebyte Folder
            </a>
          ) : (
            <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-500">
              Partner has not shared the folder link yet
            </span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Sales And Purchase Overview</h2>
            <p className="mt-1 text-sm text-slate-500">
              Switch between normal data, bar graph, and line graph for the sales and purchase values entered by your assigned partner.
            </p>
          </div>
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setChartView("normal")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                chartView === "normal" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
              }`}
            >
              Normal Data
            </button>
            <button
              type="button"
              onClick={() => setChartView("bar")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                chartView === "bar" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
              }`}
            >
              Bar Graph
            </button>
            <button
              type="button"
              onClick={() => setChartView("line")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                chartView === "line" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
              }`}
            >
              Line Graph
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="inline-flex items-center gap-2 text-slate-600">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            Sales
          </div>
          <div className="inline-flex items-center gap-2 text-slate-600">
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            Purchase
          </div>
        </div>

        <div className="mt-6">
          {salesRecords.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              No monthly sales or purchase data available yet.
            </div>
          ) : chartView === "normal" ? (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full">
                <thead className="bg-slate-50 text-left text-sm text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Sales</th>
                    <th className="px-4 py-3">Purchase</th>
                  </tr>
                </thead>
                <tbody>
                  {salesRecords.map((record) => (
                    <tr key={`${record.month}-${record.year}-normal`} className="border-t border-slate-100 text-sm">
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {record.month} {record.year}
                      </td>
                      <td className="px-4 py-3 text-slate-600">Rs. {Number(record.sales || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-600">Rs. {Number(record.purchase || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : chartView === "bar" ? (
            <div className="space-y-5">
              {salesRecords.map((record) => (
                <div key={`${record.month}-${record.year}-bar`} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {record.month} {record.year}
                    </span>
                    <span className="text-slate-500">
                      Sales: Rs. {Number(record.sales || 0).toLocaleString()} | Purchase: Rs. {Number(record.purchase || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="grid gap-3">
                    <div>
                      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Sales</div>
                      <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                          style={{ width: `${Math.max((Number(record.sales || 0) / chartMaxValue) * 100, 6)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Purchase</div>
                      <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                          style={{ width: `${Math.max((Number(record.purchase || 0) / chartMaxValue) * 100, 6)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <svg viewBox="0 0 100 100" className="h-[320px] w-full overflow-visible">
                <line x1="0" y1="100" x2="100" y2="100" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="0" y2="100" stroke="#cbd5e1" strokeWidth="1.5" />
                {salesLinePoints && (
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    points={salesLinePoints}
                  />
                )}
                {purchaseLinePoints && (
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    points={purchaseLinePoints}
                  />
                )}
                {salesRecords.map((record, index) => {
                  const x = salesRecords.length <= 1 ? 50 : (index / (salesRecords.length - 1)) * 100;
                  const salesY = 100 - (Number(record.sales || 0) / chartMaxValue) * 100;
                  const purchaseY = 100 - (Number(record.purchase || 0) / chartMaxValue) * 100;

                  return (
                    <g key={`${record.month}-${record.year}-line`}>
                      <circle cx={x} cy={salesY} r="1.8" fill="#3b82f6" />
                      <circle cx={x} cy={purchaseY} r="1.8" fill="#f59e0b" />
                      <text x={x} y="108" textAnchor="middle" fontSize="4" fill="#64748b">
                        {record.month.slice(0, 3)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">GST Filing Dates</h2>
        <p className="mt-1 text-sm text-slate-500">These filing dates are managed by your assigned partner.</p>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50 text-left text-sm text-slate-500">
              <tr>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">GSTR-1</th>
                <th className="px-4 py-3">GSTR-3B</th>
              </tr>
            </thead>
            <tbody>
              {salesRecords.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500">
                    No GST filing data available yet.
                  </td>
                </tr>
              ) : (
                salesRecords.map((record) => (
                  <tr key={`${record.month}-${record.year}-filing`} className="border-t border-slate-100 text-sm">
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {record.month} {record.year}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(record.gstr1FiledOn)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(record.gstr3bFiledOn)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <section id="documents" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Documents</h2>
            <p className="mt-1 text-sm text-slate-500">
              View both the documents shared by your partner and the files you have uploaded yourself.
            </p>
          </div>
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setDocumentTab("partner")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                documentTab === "partner" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
              }`}
            >
              Shared By Partner
            </button>
            <button
              type="button"
              onClick={() => setDocumentTab("client")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                documentTab === "client" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
              }`}
            >
              Shared By You
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          {documentTab === "partner" && clientInfo.clientDocumentsFolderLink ? (
            <a
              href={clientInfo.clientDocumentsFolderLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ExternalLink size={16} />
              Open Client Folder
            </a>
          ) : null}
          {documentTab === "client" && clientInfo.clientSharedFolderLink ? (
            <a
              href={clientInfo.clientSharedFolderLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ExternalLink size={16} />
              Open Client To Partner Folder
            </a>
          ) : null}
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
            {visibleDocuments.length} files
          </span>
        </div>

        {documentTab === "client" && (
          <form onSubmit={handleClientUpload} className="mt-6 rounded-xl border border-dashed border-slate-300 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-3 text-slate-500">
                  <UploadCloud size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{file ? file.name : "Choose file to share with partner"}</p>
                  <p className="text-sm text-slate-500">Supported: PDF, Excel, Word, text, JSON, images, and other common files up to 25MB</p>
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
                  disabled={!file || uploading}
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
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {!visibleDocuments.length ? (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              {documentTab === "partner" ? "No partner-shared files yet." : "No files uploaded by you yet."}
            </div>
          ) : (
            visibleDocuments.map((doc) => (
              <div key={doc._id} className="rounded-xl border border-slate-200 p-4 transition hover:shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="rounded-lg bg-slate-50 p-3">{getFileIcon(doc.fileName)}</div>
                    <div className="overflow-hidden">
                      <p className="truncate font-semibold text-slate-800">{doc.fileName}</p>
                      <p className="text-xs text-slate-500">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleView(doc._id, doc.fileName)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(doc._id, doc.fileName)}
                      className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-slate-800">ITC Ledger</h2>
          <p className="text-sm text-slate-500">
            Opening balance flows from the previous month&apos;s closing balance. Debits and credits are managed by your partner.
          </p>
        </div>

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
                    key={`client-itc-head-${label}-${index}`}
                    className={`border-b border-slate-700 px-3 py-3 text-center ${index % 3 === 0 ? "border-l" : ""}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salesRecords.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-8 text-center text-sm text-slate-500">
                    No ITC ledger data available yet.
                  </td>
                </tr>
              ) : (
                salesRecords.map((record) => (
                  <tr key={`${record.month}-${record.year}-itc`} className="border-t border-slate-100 bg-white">
                    <td className="px-4 py-4 font-semibold text-slate-800 whitespace-nowrap">
                      {record.month.slice(0, 3)}-{String(record.year).slice(-2)}
                    </td>
                    {(["openingBalance", "debits", "credits", "closingBalance"] as const).flatMap((field) =>
                      taxTypes.map((taxType, taxIndex) => (
                        <td
                          key={`${record.month}-${taxType}-${field}`}
                          className={`px-3 py-3 ${taxIndex === 0 ? "border-l border-slate-200" : ""}`}
                        >
                          <div className={`rounded-lg px-3 py-2 text-sm font-medium ${
                            field === "closingBalance"
                              ? "bg-emerald-50 text-emerald-700"
                              : field === "openingBalance"
                                ? "bg-slate-100 text-slate-700"
                                : field === "debits"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-cyan-50 text-cyan-700"
                          }`}>
                            {Number(record.itc?.[taxType]?.[field] || 0).toLocaleString()}
                          </div>
                        </td>
                      ))
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
