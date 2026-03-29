export interface CreateCompanyRequest {
  companyName: string;
  website: string;
}

export interface CreateCompanyResponse {
  id: number;
  companyName: string;
  website: string;
}

export interface CompanyResponse {
  id: number;
  name: string;
  email: string;

  companyName: string;
  photoUrl: string;
  username: string;
  website: string;
}

interface CompanyData {
  companyName: string;
  email: string;
  photoUrl: string;
  username: string;
  website: string;
}

export interface UploadPhotoResponse {
  message: string;
  fileUrl: string; // serverdən gələn fayl linki
}


export interface DecideApplicationRequest {
  applicationId: number;
  isAccepted: boolean;
  reason?: string;
}