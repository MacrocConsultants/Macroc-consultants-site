import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default api;  // ✅ VERY IMPORTANT  - DO NOT DELETE THIS FILE OR CHANGE THE EXPORT, OTHERWISE API CALLS THROUGHOUT THE APP WILL BREAK!
