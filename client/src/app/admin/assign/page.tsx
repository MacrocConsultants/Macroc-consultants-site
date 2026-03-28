"use client";

import { useEffect, useState } from "react";
import api from "../../../utils/api";

export default function AssignClient() {
  const [clients, setClients] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [clientId, setClientId] = useState("");
  const [partnerId, setPartnerId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientRes = await api.get("/clients");
        const userRes = await api.get("/users");

        setClients(clientRes.data);
        setPartners(userRes.data.filter((u: any) => u.role === "partner"));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!clientId || !partnerId) {
      alert("Select both fields");
      return;
    }

    try {
      await api.post("/admin/assign", { clientId, partnerId });
      alert("Assigned successfully");
    } catch {
      alert("Error assigning");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-6">Assign Client</h1>

      <select
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        className="border p-2 w-full mb-4"
      >
        <option value="">Select Client</option>
        {clients.map((c) => (
          <option key={c._id} value={c._id}>
            {c.companyName}
          </option>
        ))}
      </select>

      <select
        value={partnerId}
        onChange={(e) => setPartnerId(e.target.value)}
        className="border p-2 w-full mb-4"
      >
        <option value="">Select Partner</option>
        {partners.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleAssign}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Assign
      </button>
    </div>
  );
}