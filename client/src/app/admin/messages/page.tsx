"use client";

import { useEffect, useState } from "react";
import api from "../../../utils/api";

type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  serviceRequired: string;
  message: string;
  status: "new" | "reviewed";
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const fetchMessages = async () => {
    setLoading(true);

    try {
      const res = await api.get("/contact");
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch {
      setStatusMessage("Could not load website messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleStatus = async (message: ContactMessage) => {
    setUpdatingId(message._id);
    setStatusMessage("");

    try {
      await api.put(`/contact/${message._id}`, {
        status: message.status === "new" ? "reviewed" : "new",
      });
      fetchMessages();
    } catch {
      setStatusMessage("Could not update the message status.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800">Website Messages</h1>
        <p className="mt-2 text-sm text-slate-500">
          Every enquiry sent from the public Contact Us form is stored here as well as being sent through Formspree mail.
        </p>
      </div>

      {statusMessage && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
          {statusMessage}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Loading contact messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            No website messages have been received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-slate-800">{item.name}</h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "new"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      <strong>Email:</strong> {item.email}
                    </p>
                    <p className="text-sm text-slate-600">
                      <strong>Mobile:</strong> {item.mobile}
                    </p>
                    <p className="text-sm text-slate-600">
                      <strong>Service:</strong> {item.serviceRequired}
                    </p>
                    <p className="text-sm text-slate-500">
                      <strong>Received:</strong> {new Date(item.createdAt).toLocaleString()}
                    </p>
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 whitespace-pre-line">
                      {item.message}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleStatus(item)}
                    disabled={updatingId === item._id}
                    className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updatingId === item._id
                      ? "Saving..."
                      : item.status === "new"
                        ? "Mark Reviewed"
                        : "Mark New"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
