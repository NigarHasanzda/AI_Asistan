import api, {
  getErrorDetails,
  JSON_HEADERS,
  MULTIPART_HEADERS,
  request,
  requireToken,
  withAuth,
} from "@/services/api";
import { CreateProfileRequest, CreateProfileResponse } from "@/types/register";

export const CreateStudentProfile = async (
  profileData: CreateProfileRequest
): Promise<CreateProfileResponse> => {
  const token = requireToken();

  const response = await api.post<CreateProfileResponse>(
    "/Students/create-profile",
    profileData,
    withAuth(token)
  );
  return response.data;
};

export const CreateStudentSkill = async (skillName: string, token: string) =>
  request("Skill POST error:", () =>
    // Body object yox, birbaşa string kimi göndərilir
    api.post("/Students/skills", skillName, withAuth(token, { headers: JSON_HEADERS }))
  );

export const CreateProject = async (
  projectData: {
    name: string;
    description: string;
    projectUrl: string;
    skillNames: Array<string>;
  },
  token: string
) => {
  try {
    const { data } = await api.post(
      "/Projects",
      projectData,
      withAuth(token, { headers: JSON_HEADERS })
    );
    return data;
  } catch (error: any) {
    console.log("Project POST error:", getErrorDetails(error));
    throw new Error(error.response?.data?.title || "Project əlavə edilərkən xəta baş verdi");
  }
};

export const CreateExperience = async (
  experienceData: {
    companyName: string;
    designation: string;
    startDate: string;
    endDate: string;
    description: string;
  },
  token: string
) => {
  try {
    const { data } = await api.post("/Experiences", experienceData, withAuth(token));
    return data;
  } catch (error: any) {
    console.log("Experience POST error:", getErrorDetails(error));
    throw new Error(error.response?.data?.title || "Experience əlavə edilərkən xəta baş verdi");
  }
};

export const UploadStudentPhoto = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("file", file);

  return request("Photo upload error:", () =>
    api.post("/Students/upload-photo", formData, withAuth(token, { headers: MULTIPART_HEADERS }))
  );
};
