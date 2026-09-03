import axios from "axios";

// Ajwa Sweets' own Node/Express/MongoDB backend (separate deployment and
// database from any other project). In the combined single-deployment setup
// this defaults to the relative "/api" path below and needs no configuration —
// only set NEXT_PUBLIC_API_URL if the backend is deployed somewhere separate.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ajwa_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
