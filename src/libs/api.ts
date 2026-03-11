import axios from "axios";

const api = axios.create({
  baseURL: "https://khalida06-001-site1.ntempurl.com/api",
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");
  console.log("Interceptor içində token:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;