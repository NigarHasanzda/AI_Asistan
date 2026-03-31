// services/Admin/Company.ts
import api from "../api";

// Şirkətləri götür
export const getAdminCompanies = async (params: any = {}) => {
  try {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    const response = await api.get("/Admin/companies", {
      params: {
        keyword: params?.keyword || "",
        isApproved: params?.isApproved ?? "",
        isRejected: params?.isRejected ?? "",
        isPremium: params?.isPremium ?? "",
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get companies error:", error);
    throw error;
  }
};

// Şirkəti ID ilə götür
export const getAdminCompanyById = async (id: string | number) => {
  try {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    const response = await api.get(`/Admin/companies/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err) {
    console.error("Get company error:", err);
    throw err;
  }
};

// Şirkəti təsdiqlə
export const approveCompany = async (id: string | number) => {
  try {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    const response = await api.patch(`/Admin/companies/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err) {
    console.error("Approve company error:", err);
    throw err;
  }
};

// Şirkəti rədd et
export const rejectCompany = async (companyId: number, reason: string) => {
  try {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    const response = await api.post(
      "/Admin/companies/reject",
      { companyId, reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (err: any) {
    console.error("Reject company error:", err);
    throw err;
  }
};