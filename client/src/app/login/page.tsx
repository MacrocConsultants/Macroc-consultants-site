"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import { Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";

const captchaCharacters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function createCaptcha() {
  return Array.from({ length: 6 }, () => {
    const index = Math.floor(Math.random() * captchaCharacters.length);
    return captchaCharacters[index];
  }).join("");
}

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setCaptcha(createCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(createCaptcha());
    setCaptchaInput("");
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");

    if (captchaInput.trim().toUpperCase() !== captcha) {
      setError("Captcha does not match. Please try again.");
      refreshCaptcha();
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });

      localStorage.setItem("user", JSON.stringify(res.data));

      if (res.data.role === "super-admin" || res.data.role === "admin") router.push("/admin");
      else if (res.data.role === "partner") router.push("/partner");
      else router.push("/client");

    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">

      <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 transition duration-300 hover:shadow-[0_20px_45px_rgba(15,23,42,0.28)]">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            MACROC TEAM LOGIN
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Login to your dashboard
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input
              type="email"
              required
              value={email}
              placeholder="you@example.com"
              className="w-full border border-slate-300 p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-slate-600">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                placeholder="••••••••"
                className="w-full border border-slate-300 p-3 rounded-lg mt-1 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* SHOW PASSWORD */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* 🔥 FORGOT PASSWORD */}
            <div className="text-right mt-2">
              <span
                onClick={() => router.push("/forgot-password")}
                className="text-sm text-blue-600 cursor-pointer hover:underline"
              >
                Forgot Password?
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-600">Captcha</label>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-700"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>

            <div className="mt-2 rounded-xl border border-slate-300 bg-[linear-gradient(135deg,#eff6ff_0%,#dbeafe_45%,#f8fafc_100%)] px-4 py-3 shadow-inner">
              <div className="flex items-center justify-between gap-2">
                {captcha.split("").map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className="select-none text-xl font-bold tracking-[0.22em] text-slate-800"
                    style={{
                      transform: `rotate(${index % 2 === 0 ? -10 : 8}deg) translateY(${index % 3 === 0 ? "-1px" : "1px"})`,
                      textShadow: "1px 1px 0 rgba(37, 99, 235, 0.18)",
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>

            <input
              type="text"
              required
              value={captchaInput}
              maxLength={6}
              placeholder="Enter the 6-character captcha"
              className="w-full border border-slate-300 p-3 rounded-lg mt-3 uppercase tracking-[0.18em] focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            disabled={loading}
            className="pro-interactive w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* REGISTER LINK */}
        <p className="text-sm text-center mt-6 text-slate-500">
          New user?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Register here
          </span>
        </p>

      </div>
    </div>
  );
}
