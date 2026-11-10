import api, { request } from "../api";

/** Şirkətlər (filter + pagination). */
export const getAdminCompanies = async (params: any = {}) =>
  request("Get companies error:", () =>
    api.get("/Admin/companies", {
      params: {
        keyword: params?.keyword || "",
        isApproved: params?.isApproved ?? "",
        isRejected: params?.isRejected ?? "",
        isPremium: params?.isPremium ?? "",
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
      },
    })
  );

export const getAdminCompanyById = async (id: string | number) =>
  request("Get company error:", () => api.get(`/Admin/companies/${id}`));

export const approveCompany = async (id: string | number) =>
  request("Approve company error:", () => api.patch(`/Admin/companies/${id}/approve`, {}));

export const rejectCompany = async (companyId: number, reason: string) =>
  request("Reject company error:", () =>
    api.post("/Admin/companies/reject", { companyId, reason })
  );
