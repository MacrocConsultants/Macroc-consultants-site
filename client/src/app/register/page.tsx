"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    gstin: "",
    state: "",
    city: "",
    otherCategory: "",
    password: "",
    businessName: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const servicesList = [
    "GST",
    "Income Tax",
    "Accounting",
    "Registrations",
    "Certificates",
    "MCA Filings",
    "TDS",
    "Incorporations",
    "Other",
  ];

  const gstinPattern = /^[0-9A-Z]{15}$/;

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "gstin" ? value.toUpperCase() : value,
    });
  };

  const handleServiceChange = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // 🔥 REGISTER → REDIRECT TO OTP PAGE
  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");

    if (selectedServices.includes("Other") && !form.otherCategory.trim()) {
      setError("Please enter the other category");
      return;
    }

    if (form.gstin && !gstinPattern.test(form.gstin.trim())) {
      setError("Please enter a valid 15-character GSTIN");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/register", {
        ...form,
        services: selectedServices,
      });

      // ✅ REDIRECT TO OTP PAGE
      router.push(`/verify-otp?email=${form.email}`);

    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
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
            Create Account
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Register to access your dashboard
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            required
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <input
            name="mobileNumber"
            type="tel"
            placeholder="Mobile Number"
            required
            inputMode="numeric"
            pattern="[0-9]{10}"
            title="Enter a 10-digit mobile number"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <input
            name="gstin"
            placeholder="GSTIN (15 characters)"
            value={form.gstin}
            maxLength={15}
            inputMode="text"
            className="w-full border p-3 rounded uppercase"
            onChange={handleChange}
          />

          <select
            name="state"
            required
            className="w-full border p-3 rounded bg-white"
            onChange={handleChange}
            value={form.state}
          >
            <option value="">Select State</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <input
            name="city"
            placeholder="City"
            required
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <input
            name="businessName"
            placeholder="Business Name (Optional)"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="w-full border p-3 rounded pr-10"
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* SERVICES */}
          <div>
            <p className="text-sm font-medium mb-2">Select Services</p>
            <div className="grid grid-cols-2 gap-2">
              {servicesList.map((service) => (
                <label key={service} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => handleServiceChange(service)}
                  />
                  {service}
                </label>
              ))}
            </div>
          </div>

          {selectedServices.includes("Other") && (
            <input
              name="otherCategory"
              placeholder="Other Category"
              required
              className="w-full border p-3 rounded"
              onChange={handleChange}
            />
          )}

          <button
            disabled={loading}
            className="pro-interactive w-full bg-green-600 text-white p-3 rounded font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Sending OTP...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-sm text-center mt-6 text-slate-500">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}
