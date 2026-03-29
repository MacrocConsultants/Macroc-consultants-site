"use client";

import { useState } from "react";
import api from "../../utils/api";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      return setError("Please enter email");
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/api/auth/forgot-password", { email });
      setSuccess("OTP sent successfully");
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      return setError("Enter OTP");
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/verify-reset-otp", { email, otp });
      setSuccess("OTP verified");
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      return setError("Enter new password");
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      setSuccess("Password reset successful");

      setTimeout(() => {
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="bg-white/95 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>
        )}

        {success && (
          <div className="mb-4 text-green-600 text-sm text-center bg-green-50 p-2 rounded">{success}</div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">Enter your email to receive OTP</p>

            <input
              type="email"
              value={email}
              placeholder="Email"
              className="w-full border p-3 rounded"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded font-semibold flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              OTP sent to <b>{email}</b>
            </p>

            <input
              value={otp}
              placeholder="Enter OTP"
              className="w-full border p-3 rounded text-center tracking-widest"
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white p-3 rounded font-semibold flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Verify OTP"}
            </button>

            <p
              onClick={handleSendOtp}
              className="text-sm text-blue-600 text-center cursor-pointer hover:underline"
            >
              Resend OTP
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">Enter your new password</p>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                placeholder="New Password"
                className="w-full border p-3 rounded pr-10"
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-purple-600 text-white p-3 rounded font-semibold flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
