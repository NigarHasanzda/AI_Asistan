import api, { request } from "../api";

/** Bütün müraciətlər (filter + pagination). */
export const getAdminApplications = async (params: any = {}) =>
  request("Get admin applications error:", () =>
    api.get("/Admin/applications", {
      params: {
        keyword: params?.keyword || "",
        status: params?.status ?? "",
        hasRejectionReason: params?.hasRejectionReason ?? "",
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
      },
    })
  );

export const getAdminApplicationById = async (id: number | string) =>
  request("Get admin application by id error:", () => api.get(`/Admin/applications/${id}`));
