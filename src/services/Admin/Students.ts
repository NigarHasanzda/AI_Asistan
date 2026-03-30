import { GetStudentsParams, GetStudentsResponse, StudentDetail } from "@/types/Admin/student";
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


export const getStudentById = async (id: number): Promise<StudentDetail> => {
  try {
    const token = localStorage.getItem("token"); // əgər auth varsa
    const response = await api.get(`/Admin/students/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Get Student By ID Error:", error);
    throw error;
  }
};