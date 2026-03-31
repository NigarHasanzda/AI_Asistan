import api from "../api";


export const getAdminInternships = async (params?: { page?: number; pageSize?: number }) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const response = await api.get("/Admin/internships", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    // server bəzən data obyektində ola bilər
    return response.data || [];
  } catch (err) {
    console.error("Get internships error:", err);
    return [];
  }
};

export const getAdminInternshipById = async (id: number) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const response = await api.get(`/Admin/internships/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error("Get internship by id error:", err);
    return null;
  }
};

export const deleteAdminInternship = async (id: number) => {
  try {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    const response = await api.delete(`/Admin/internships/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err: any) {
    console.error("Delete internship error:", err);
    throw err;
  }
};