import { GetStudentsParams, GetStudentsResponse } from "@/types/Admin/student";
import api from "../api";



export const getAdminStudents = async (params?: any) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/Admin/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        Keyword: params?.keyword,
        TargetJobId: params?.targetJobId,
        IsPremium: params?.isPremium,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
      },
    });

    return response.data; // 🔥 birbaşa qaytarırıq
  } catch (error) {
    console.error("Get Students Error:", error);
    throw error;
  }
};