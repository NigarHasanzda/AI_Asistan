import api from "@/services/api";
import { 
  CreateCompanyRequest, 
  CreateCompanyResponse, 
  UploadPhotoResponse,
  CompanyResponse // bunu type-larda əlavə etməlisən
} from "@/types/company";

export const createCompany = async (
  data: CreateCompanyRequest,
  token: string
): Promise<CreateCompanyResponse> => {
  const response = await api.post<CreateCompanyResponse>(
    "/Companies/company",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
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
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ✅ YENİ əlavə etdiyimiz hissə
export const getMyCompany = async (
  token: string
): Promise<CompanyResponse> => {
  const response = await api.get<CompanyResponse>(
    "/Companies/myCompany",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const getCompanyDashboard = async (
  token: string
): Promise<any> => {
  const response = await api.get(
    "/Companies/dashboard",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

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

  if (data.Username) formData.append("Username", data.Username);
  if (data.CompanyName) formData.append("CompanyName", data.CompanyName);
  if (data.Website) formData.append("Website", data.Website);
  if (data.Photo) formData.append("Photo", data.Photo);

  const response = await api.patch(
    "/Companies/updateCompany",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};