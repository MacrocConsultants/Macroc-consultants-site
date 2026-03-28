"use client";

import { useState } from "react";

type PublicContactFormProps = {
  formAction: string;
  email: string;
  formFields: {
    nameLabel: string;
    namePlaceholder: string;
    mobileLabel: string;
    mobilePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    serviceLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    buttonText: string;
  };
  serviceOptions: string[];
  defaultService: string;
};

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export default function PublicContactForm({
  formAction,
  email,
  formFields,
  serviceOptions,
  defaultService,
}: PublicContactFormProps) {
  const [selectedService, setSelectedService] = useState(defaultService);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusTone, setStatusTone] = useState<"success" | "error" | "">("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      mobile: String(formData.get("mobile") || ""),
      serviceRequired: String(formData.get("serviceRequired") || ""),
      message: String(formData.get("message") || ""),
    };

    setSubmitting(true);
    setStatusMessage("");
    setStatusTone("");

    try {
      const requests: Promise<Response>[] = [];

      if (apiBaseUrl) {
        requests.push(
          fetch(`${apiBaseUrl}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        );
      }

      requests.push(
        fetch(formAction, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        })
      );

      const responses = await Promise.all(requests);
      const hasFailedRequest = responses.some((response) => !response.ok);

      if (hasFailedRequest) {
        throw new Error("Contact submit failed");
      }

      form.reset();
      setSelectedService(serviceOptions[0] || "");
      setStatusTone("success");
      setStatusMessage("Your message has been sent successfully.");
    } catch {
      setStatusTone("error");
      setStatusMessage("Could not send your message right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 shadow-lg backdrop-blur-md"
      onSubmit={handleSubmit}
    >
      <label className="block text-sm font-medium text-gray-300">{formFields.nameLabel}</label>
      <input
        name="name"
        required
        className="mt-2 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-gray-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
        placeholder={formFields.namePlaceholder}
      />

      <label className="mt-4 block text-sm font-medium text-gray-300">{formFields.emailLabel}</label>
      <input
        name="email"
        required
        type="email"
        className="mt-2 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-gray-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
        placeholder={formFields.emailPlaceholder}
      />

      <label className="mt-4 block text-sm font-medium text-gray-300">{formFields.mobileLabel}</label>
      <input
        name="mobile"
        required
        type="tel"
        className="mt-2 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-gray-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
        placeholder={formFields.mobilePlaceholder}
      />

      <label className="mt-4 block text-sm font-medium text-gray-300">{formFields.serviceLabel}</label>
      <select
        name="serviceRequired"
        required
        value={selectedService}
        onChange={(e) => setSelectedService(e.target.value)}
        className="mt-2 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-gray-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
      >
        <option value="" disabled>
          Select a service
        </option>
        {serviceOptions.map((option, index) => (
          <option key={`${option}-${index}`} value={option}>
            {option}
          </option>
        ))}
      </select>

      <label className="mt-4 block text-sm font-medium text-gray-300">{formFields.messageLabel}</label>
      <textarea
        name="message"
        required
        rows={4}
        className="mt-2 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-gray-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
        placeholder={formFields.messagePlaceholder}
      />

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full rounded-lg bg-amber-400 px-5 py-2 font-medium text-white transition hover:scale-[1.02] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending..." : formFields.buttonText}
      </button>

      {statusMessage && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm ${
            statusTone === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {statusMessage}
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500">
        Messages will be sent securely to{" "}
        <a href={`mailto:${email}`} className="text-emerald-400">
          {email}
        </a>
        .
      </p>
    </form>
  );
}
