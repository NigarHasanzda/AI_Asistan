import api, { MULTIPART_HEADERS, request, withAuth } from "@/services/api";
import {
  CreateCompanyRequest,
  CreateCompanyResponse,
  UploadPhotoResponse,
  CompanyResponse,
  DecideApplicationRequest,
} from "@/types/company";

// ---------- Company profile ----------

export const createCompany = async (
  data: CreateCompanyRequest,
  token: string
): Promise<CreateCompanyResponse> => {
  const response = await api.post<CreateCompanyResponse>(
    "/Companies/company",
    data,
    withAuth(token)
  );
  return response.data;
};

export const uploadCompanyPhoto = async (
  file: File,
  token: string
): Promise<UploadPhotoResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadPhotoResponse>(
    "/Companies/upload-photo",
    formData,
    withAuth(token, { headers: MULTIPART_HEADERS })
  );
  return response.data;
};

export const getMyCompany = async (token: string): Promise<CompanyResponse> => {
  const response = await api.get<CompanyResponse>("/Companies/myCompany", withAuth(token));
  return response.data;
};

export const getCompanyDashboard = async (token: string): Promise<any> => {
  const response = await api.get("/Companies/dashboard", withAuth(token));
  return response.data;
};

export const updateCompany = async (
  data: {
    Username?: string;
    CompanyName?: string;
    Website?: string;
    Photo?: File;
  },
  token: string
): Promise<any> => {
  const formData = new FormData();
  (Object.entries(data) as [string, string | File | undefined][]).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  const response = await api.patch(
    "/Companies/updateCompany",
    formData,
    withAuth(token, { headers: MULTIPART_HEADERS })
  );
  return response.data;
};

// ---------- Applications ----------

export const decideApplication = async (
  data: DecideApplicationRequest,
  token: string
): Promise<any> => {
  // Reject edəndə səbəb mütləqdir; accept edəndə göndərilmir
  if (!data.isAccepted && !data.reason?.trim()) {
    throw new Error("Reject etdikdə reason yazmaq məcburidir");
  }

  const payload = {
    applicationId: data.applicationId,
    isAccepted: data.isAccepted,
    ...(data.isAccepted ? {} : { reason: data.reason }),
  };

  const response = await api.post("/Applications/decide", payload, withAuth(token));
  return response.data;
};

export const shortlistApplication = async (
  internshipId: number,
  applicationId: number,
  token?: string
) =>
  request("Shortlist error:", () =>
    api.patch(
      `/Internships/${internshipId}/applications/${applicationId}/shortlist`,
      {},
      token ? withAuth(token) : undefined
    )
  );

export const removeShortlistApplication = async (
  internshipId: number,
  applicationId: number,
  token: string
) => {
  const response = await api.patch(
    `/Internships/${internshipId}/applications/${applicationId}/remove-shortlist`,
    {},
    withAuth(token)
  );
  return response.data;
};
