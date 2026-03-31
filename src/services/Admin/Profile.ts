import api from "../api";

export const getAdminProfile = async () => {
  try {
    let token = "";

    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    const response = await api.get("/Admin/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Admin profile error:", error);
    throw error;
  }
};


export const updateAdminProfile = async (data: {
  username: string;
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    let token = "";

    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    const response = await api.patch("/Admin/profile", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Update profile error:", error);
    throw error;
  }
};