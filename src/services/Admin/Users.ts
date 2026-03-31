import api from "../api";

// GET USERS
export const getAdminUsers = async (params: any = {}) => {
  try {
    let token = "";

    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    const response = await api.get("/Admin/users", {
      params: {
        keyword: params?.keyword || "",
        isProfileCompleted: params?.isProfileCompleted ?? "",
        isBanned: params?.isBanned ?? "",
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get users error:", error);
    throw error;
  }
};

// BAN USER
export const banUser = async (userId: string, reason: string) => {
  try {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    const response = await api.patch(
      `/Admin/users/ban`,
      { userId, reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Ban user error:", error);
    throw error;
  }
};

// UNBAN USER
export const unbanUser = async (userId: string) => {
  try {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    const response = await api.patch(
      `/Admin/users/${userId}/unban`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Unban user error:", error);
    throw error;
  }
};