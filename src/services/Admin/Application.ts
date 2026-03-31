import api from "../api";

// 🔹 Bütün application-ları gətir (filter + pagination)
export const getAdminApplications = async (params: any = {}) => {
  try {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    const response = await api.get("/Admin/applications", {
      params: {
        keyword: params?.keyword || "",
        status: params?.status ?? "",
        hasRejectionReason: params?.hasRejectionReason ?? "",
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Get admin applications error:", err);
    throw err;
  }
};

// 🔹 ID-yə görə application
export const getAdminApplicationById = async (id: number | string) => {
  try {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    const response = await api.get(`/Admin/applications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Get admin application by id error:", err);
    throw err;
  }
};