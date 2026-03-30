import { AdminDashboardResponse } from "@/types/Admin/dashboard";
import api from "../api";

export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/Admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Admin Dashboard Error:", error);
    throw error;
  }
};