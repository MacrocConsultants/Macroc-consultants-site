"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import api from "../../../utils/api";

type PartnerUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  partnerSpacebyteFolderLink?: string;
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPartnerId, setSavingPartnerId] = useState("");
  const [message, setMessage] = useState("");

  const fetchPartners = async () => {
    setLoading(true);

    try {
      const res = await api.get("/users");
      const partnerUsers = (Array.isArray(res.data) ? res.data : []).filter(
        (user: PartnerUser) => user.role === "partner"
      );
      setPartners(partnerUsers);
    } catch {
      setMessage("Could not load partner data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const partnerCount = useMemo(() => partners.length, [partners]);

  const handleFieldChange = (id: string, value: string) => {
    setPartners((current) =>
      current.map((partner) =>
        partner._id === id
          ? { ...partner, partnerSpacebyteFolderLink: value }
          : partner
      )
    );
  };

  const handleSave = async (partner: PartnerUser) => {
    setSavingPartnerId(partner._id);
    setMessage("");

    try {
      await api.put(`/users/${partner._id}`, {
        name: partner.name,
        email: partner.email,
        role: partner.role,
        partnerSpacebyteFolderLink: partner.partnerSpacebyteFolderLink || "",
      });

      setMessage(`Saved Spacebyte folder for ${partner.name}.`);
      fetchPartners();
    } catch {
      setMessage(`Could not save folder link for ${partner.name}.`);
    } finally {
      setSavingPartnerId("");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["super-admin"]}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-800">Partners</h1>
          <p className="mt-2 text-sm text-slate-500">
            Assign a dedicated Spacebyte folder to each partner. When a partner uploads files for different clients, those files will go into the folder allotted here instead of falling into a generic all-files location.
          </p>
          <div className="mt-4 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            Total Partners: {partnerCount}
          </div>
        </div>

        {message && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            {message}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Partner Storage Assignment</h2>
            <p className="mt-1 text-sm text-slate-500">
              Paste the Spacebyte folder link created for each partner. That folder will become the preferred upload target for partner-side client document uploads.
            </p>
          </div>

          {loading ? (
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Loading partner list...
            </div>
          ) : partners.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              No partner users found yet.
            </div>
          ) : (
            <div className="space-y-4">
              {partners.map((partner) => (
                <div
                  key={partner._id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold text-slate-800">{partner.name}</h3>
                        <p className="text-sm text-slate-500">{partner.email}</p>
                      </div>

                      <label className="mt-4 block">
                        <span className="mb-2 block text-sm font-medium text-slate-700">
                          Partner Spacebyte Folder Link
                        </span>
                        <input
                          value={partner.partnerSpacebyteFolderLink || ""}
                          onChange={(e) => handleFieldChange(partner._id, e.target.value)}
                          placeholder="Paste Spacebyte partner folder link"
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSave(partner)}
                      disabled={savingPartnerId === partner._id}
                      className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingPartnerId === partner._id ? "Saving..." : "Save Folder"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
