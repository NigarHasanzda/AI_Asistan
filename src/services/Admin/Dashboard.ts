import { AdminDashboardResponse } from "@/types/Admin/dashboard";
import api, { request } from "../api";

export const getAdminDashboard = async (): Promise<AdminDashboardResponse> =>
  request<AdminDashboardResponse>("Admin Dashboard Error:", () => api.get("/Admin/dashboard"));
