
import api from "@/libs/api";
import { CreateProfileRequest, CreateProfileResponse, CreateSkillRequest, CreateSkillResponse, RegisterRequest, RegisterResponse } from "@/types/register";

export const UserRegister = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>("/Auth/register", userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server cavabı gəlib
      throw new Error(error.response.data.message || "Qeydiyyat zamanı xəta baş verdi");
    } else {
      // Şəbəkə və ya başqa xəta
      throw new Error(error.message || "Serverə qoşulmaq mümkün olmadı");
    }
  }
};


export const CreateStudentProfile = async (
  profileData: CreateProfileRequest,
  token: string // Bearer token
): Promise<CreateProfileResponse> => {
  try {
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
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Profile yaradılarkən xəta baş verdi");
    } else {
      throw new Error(error.message || "Serverə qoşulmaq mümkün olmadı");
    }
  }
};

export const CreateStudentSkill = async (skill: string, token: string) => {
  try {
    const response = await api.post(
      "/Students/skills",
      { skillNames: skill },  // 🔹 burada skillName açarı olmalıdır
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // 🔹 mütləq
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("Skill POST error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.errors?.skillName?.[0] || 
      "Skill əlavə edilərkən xəta baş verdi"
    );
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