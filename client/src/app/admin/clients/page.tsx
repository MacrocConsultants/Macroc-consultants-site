"use client";
import { useEffect, useState, useMemo } from "react";
import api from "../../../utils/api";
import { Plus, Search, Filter, Trash2, FileText, Download } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  
  // Search & Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ name: "", companyName: "", clientId: "", assignedPartner: "" });

  const fetchData = async () => {
    try {
      const [clientsRes, usersRes] = await Promise.all([
        api.get("/clients"),
        api.get("/users")
      ]);
      setClients(clientsRes.data);
      
      const allUsers = usersRes.data;
      setUsers(allUsers.filter((u: any) => u.role === "client"));
      setPartners(allUsers.filter((u: any) => u.role === "partner"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedClient) return;

    setUploading(true);
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      await api.post(`/clients/${selectedClient._id}/upload`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("File uploaded successfully");
      setFile(null);
      fetchData();
      
      const updatedClient = (await api.get(`/clients`)).data.find((c: any) => c._id === selectedClient._id);
      setSelectedClient(updatedClient);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      if (!formData.clientId || !formData.name || !formData.companyName) {
        toast.error("Please fill out required fields.");
        return;
      }
      
      const payload: any = { ...formData };
      if (!payload.assignedPartner) delete payload.assignedPartner; // null out if empty

      await api.post("/clients", payload);
      toast.success("Client Created Successfully!");
      setShowModal(false);
      fetchData();
      setFormData({ name: "", companyName: "", clientId: "", assignedPartner: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create client.");
    }
  };

  const filteredClients = useMemo(() => {
    let result = clients;
    if (statusFilter !== "all") {
      result = result.filter((c: any) => c.status === statusFilter);
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((c: any) => c.name.toLowerCase().includes(s) || c.companyName.toLowerCase().includes(s));
    }
    return result;
  }, [clients, search, statusFilter]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const displayedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Clients</h1>
          <p className="text-sm text-slate-500 mt-1">Add, update, and review client statuses and documents.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center shadow-md shadow-blue-500/20">
          <Plus size={18} className="mr-2" /> New Client
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or company..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="border border-slate-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Company</th>
                <th className="p-4 font-semibold">Partner</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {displayedClients.length === 0 && (
                 <tr><td colSpan={5} className="p-8 text-center text-slate-500">No clients found matching the criteria.</td></tr>
              )}
              {displayedClients.map((c: any) => (
                <tr key={c._id} className="border-b last:border-b-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{c.name}</td>
                  <td className="p-4 text-slate-500">{c.companyName}</td>
                  <td className="p-4 text-slate-500">{c.assignedPartner?.name || <span className="text-slate-400 italic">Unassigned</span>}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${c.status === "active" ? "bg-green-50 text-green-700 border-green-200" : 
                        c.status === "completed" ? "bg-purple-50 text-purple-700 border-purple-200" : 
                        "bg-yellow-50 text-yellow-700 border-yellow-200"}`
                      }>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setSelectedClient(c)} className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 transition-colors">
                      <FileText size={16} /> Manage Docs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-3 py-1 border border-slate-300 rounded bg-white text-sm disabled:opacity-50 hover:bg-slate-100"
              >
                Previous
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 py-1 border border-slate-300 rounded bg-white text-sm disabled:opacity-50 hover:bg-slate-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Manage Documents: {selectedClient.companyName}</h3>
              <button onClick={() => setSelectedClient(null)} className="text-slate-500 text-2xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleUpload} className="flex gap-4 items-center mb-6 bg-slate-50 p-4 rounded border">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="flex-1 border p-2 rounded text-sm bg-white"
              />
              <button 
                type="submit" 
                disabled={!file || uploading} 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload File"}
              </button>
            </form>

            <h4 className="font-bold mb-3 text-slate-700">Uploaded Documents</h4>
            <div className="border rounded overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-3 text-slate-500 text-sm">File Name</th>
                    <th className="p-3 text-slate-500 text-sm">Date</th>
                    <th className="p-3 text-slate-500 text-right text-sm">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {!selectedClient.documents || selectedClient.documents.length === 0 ? (
                    <tr><td colSpan={3} className="p-4 text-center text-slate-400">No documents.</td></tr>
                  ) : (
                    selectedClient.documents.map((doc: any) => (
                      <tr key={doc._id} className="border-b">
                        <td className="p-3 font-medium text-sm">{doc.fileName}</td>
                        <td className="p-3 text-slate-500 text-sm">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                        <td className="p-3 text-right">
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">View</a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create New Client</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" placeholder="Client Name" className="w-full border p-2 rounded" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <input type="text" placeholder="Company Name" className="w-full border p-2 rounded" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} required />
              
              <select className="w-full border p-2 rounded" value={formData.clientId} onChange={(e) => setFormData({...formData, clientId: e.target.value})} required>
                <option value="" disabled>Select User Login Account</option>
                {users.map((u: any) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
              </select>

              <select className="w-full border p-2 rounded" value={formData.assignedPartner} onChange={(e) => setFormData({...formData, assignedPartner: e.target.value})}>
                <option value="">-- Assign Partner (Optional) --</option>
                {partners.map((p: any) => <option key={p._id} value={p._id}>{p.name} ({p.email})</option>)}
              </select>

              <div className="flex gap-2 justify-end mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}