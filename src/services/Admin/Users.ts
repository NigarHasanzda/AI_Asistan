import api, { request } from "../api";

/** İstifadəçilər (filter + pagination). */
export const getAdminUsers = async (params: any = {}) =>
  request("Get users error:", () =>
    api.get("/Admin/users", {
      params: {
        keyword: params?.keyword || "",
        isProfileCompleted: params?.isProfileCompleted ?? "",
        isBanned: params?.isBanned ?? "",
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
      },
    })
  );

export const banUser = async (userId: string, reason: string) =>
  request("Ban user error:", () => api.patch("/Admin/users/ban", { userId, reason }));

export const unbanUser = async (userId: string) =>
  request("Unban user error:", () => api.patch(`/Admin/users/${userId}/unban`, {}));
