// libs/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://khalida06-001-site1.ntempurl.com/api",
});

export default api;