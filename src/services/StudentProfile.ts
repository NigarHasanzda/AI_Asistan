import api from "@/services/api";
import { MatchedInternshipParams } from "@/types/Student";

// Profil məlumatını əldə et
export const GetStudentProfile = async (token: string) => {
  try {
    const response = await api.get("/Students/get-profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.log("Get profile error:", error.response?.data || error.message);
    throw error;
  }
};

// Profil analizi
export const analyzeProfile = async () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");

  try {
    const response = await api.get("/Students/analyze-profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Profil analizi zamanı xəta:", error.response?.data || error.message);
    throw error;
  }
};

// Dashboard
export const getStudentDashboard = async () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");

  try {
    const response = await api.get("/Students/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Dashboard əldə edilərkən xəta:", error.response?.data || error.message);
    throw error;
  }
};


// Profil yeniləmə (PATCH)
export const updateFullStudentProfile = async (profileData: FormData) => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");

  try {
    const response = await api.patch("/Students/update-profile", profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // ❗ Content-Type YAZMA!
        // axios özü avtomatik multipart/form-data qoyacaq
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Profil yenilənərkən xəta:",
      error.response?.data || error.message
    );
    throw error;
  }
};


// Skill silmək
export const deleteStudentSkill = async (skillId: number) => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");

  try {
    const response = await api.delete(`/Students/${skillId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Skill silinərkən xəta:",
      error.response?.data || error.message
    );
    throw error;
  }
};