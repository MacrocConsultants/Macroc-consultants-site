import axios from "axios";

const rawBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const baseHasApiSuffix = /\/api$/i.test(rawBaseUrl);

const api = axios.create({
  baseURL: rawBaseUrl,
});

const normalizeApiPath = (url: string) => {
  if (!url || /^https?:\/\//i.test(url)) {
    return url;
  }

  const normalized = url.startsWith("/") ? url : `/${url}`;
  const hasApiPrefix = normalized === "/api" || normalized.startsWith("/api/");

  if (baseHasApiSuffix && hasApiPrefix) {
    const stripped = normalized.replace(/^\/api(?=\/|$)/, "");
    return stripped || "/";
  }

  if (!baseHasApiSuffix && !hasApiPrefix) {
    return `/api${normalized}`;
  }

  return normalized;
};

api.interceptors.request.use((config) => {
  if (typeof config.url === "string") {
    config.url = normalizeApiPath(config.url);
  }

  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }

  return config;
});

export default api;
