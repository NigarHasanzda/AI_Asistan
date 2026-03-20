import api from "@/libs/api";
import { CreateCompanyRequest, CreateCompanyResponse, UploadPhotoResponse } from "@/types/company";

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