"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../utils/api";

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔥 GET EMAIL FROM URL
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      alert("✅ Verification successful");

      router.push("/login");

    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-2">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          OTP sent to <span className="font-medium">{email}</span>
        </p>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">

          <input
            type="text"
            placeholder="Enter OTP"
            required
            className="w-full border p-3 rounded text-center tracking-widest"
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded font-bold"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

      </div>
    </div>
  );
}