import api, { request } from "../api";

export interface UpdateAdminProfileRequest {
  username: string;
  currentPassword: string;
  newPassword: string;
}

export const getAdminProfile = async () =>
  request("Admin profile error:", () => api.get("/Admin/profile"));

export const updateAdminProfile = async (data: UpdateAdminProfileRequest) =>
  request("Update profile error:", () => api.patch("/Admin/profile", data));
