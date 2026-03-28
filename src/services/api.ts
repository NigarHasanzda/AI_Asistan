"use client";
import axios from "axios";

const api = axios.create({
  baseURL: "https://khalida06-001-site1.ntempurl.com/api",
});

if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

export default api;