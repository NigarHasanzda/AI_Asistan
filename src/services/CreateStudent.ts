import api from "@/libs/api";
import { CreateProfileRequest, CreateProfileResponse } from "@/types/register";

export const CreateStudentProfile = async (
  profileData: CreateProfileRequest
): Promise<CreateProfileResponse> => {

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token tapılmadı");
  }

  const response = await api.post<CreateProfileResponse>(
    "/Students/create-profile",
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const CreateStudentSkill = async (
  skillName: string,
  token: string
) => {
  try {
    const response = await api.post(
      "/Students/skills",
      skillName, // ⚡ object yox, birbaşa string
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("Skill POST error:", error.response?.data);
    throw error;
  }
};

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
    const response = await api.post("/Projects", projectData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("Project POST error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.title || "Project əlavə edilərkən xəta baş verdi"
    );
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
    const response = await api.post("/Experiences", experienceData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.log("Experience POST error:", error.response?.data || error.message);

    throw new Error(
      error.response?.data?.title || "Experience əlavə edilərkən xəta baş verdi"
    );
  }
};




export const UploadStudentPhoto = async (file: File, token: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/Students/upload-photo", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.log("Photo upload error:", error.response?.data);
    throw error;
  }
};