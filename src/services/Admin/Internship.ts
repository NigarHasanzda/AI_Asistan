import api, { logApiError, request } from "../api";

/** Admin üçün internship siyahısı. Xəta olarsa boş array qaytarır. */
export const getAdminInternships = async (params?: { page?: number; pageSize?: number }) => {
  try {
    const { data } = await api.get("/Admin/internships", { params });
    return data || [];
  } catch (error) {
    logApiError("Get internships error:", error);
    return [];
  }
};

/** Xəta olarsa null qaytarır. */
export const getAdminInternshipById = async (id: number) => {
  try {
    const { data } = await api.get(`/Admin/internships/${id}`);
    return data;
  } catch (error) {
    logApiError("Get internship by id error:", error);
    return null;
  }
};

export const deleteAdminInternship = async (id: number) =>
  request("Delete internship error:", () => api.delete(`/Admin/internships/${id}`));
