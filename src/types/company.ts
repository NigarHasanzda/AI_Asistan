export interface CreateCompanyRequest {
  companyName: string;
  website: string;
}

export interface CreateCompanyResponse {
  id: number;
  companyName: string;
  website: string;
}

export interface UploadPhotoResponse {
  message: string;
  fileUrl: string; // serverdən gələn fayl linki
}