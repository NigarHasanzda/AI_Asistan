// services/Leaderboards.ts
import api from "@/libs/api"; // axios instance

export const getLeaderboards = async (targetJobId?: number) => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");

  try {
    const response = await api.get("/Leaderboards", {
      headers: { Authorization: `Bearer ${token}` },
      params: targetJobId ? { targetJobId } : {},
    });
    return response.data;
  } catch (err: any) {
    console.error("Leaderboards alınarkən xəta:", err.response?.data || err.message);
    throw err;
  }
};

// Yeni funksiyanı əlavə edirik
export const toggleOptIn = async () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");

  try {
    const response = await api.patch("/Leaderboards/toggle-opt-in", null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // serverdən gələn nəticəni qaytarır
  } catch (err: any) {
    console.error("Toggle opt-in zamanı xəta:", err.response?.data || err.message);
    throw err;
  }
};