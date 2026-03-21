import api from "@/libs/api";
import { CreateInternshipDto } from "@/types/internship";

// Internship yaratmaq
export const createInternship = async (data: CreateInternshipDto) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.post("/Internships", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Internship yaradılarkən xəta:", error);
    console.error("Backend error:", error.response?.data);
    throw error;
  }
};

// Şirkətin internshiplərini gətirmək
export const getCompanyInternships = async (params: any = {}) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/Companies/internships", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Internships gətirilərkən xəta:", error);
    console.error("Backend error:", error.response?.data);
    return [];
  }
};


export const addSkillToInternship = async (internshipId: number, skill: string) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.post(`/Internships/${internshipId}/skills`, skill, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Skill əlavə edilərkən xəta:", error);
    console.error("Backend error:", error.response?.data);
    throw error;
  }
};

export const deleteInternship = async (internshipId: number) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.delete(`/Internships/${internshipId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Backend 200 qaytarır
  } catch (error: any) {
    console.error("Internship silinərkən xəta:", error);
    console.error("Backend error:", error.response?.data);
    throw error;
  }
};

// Bir internship-i ID ilə gətirmək
export const getInternshipById = async (internshipId: number) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(`/Internships/${internshipId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Backend 200 qaytarır və internship obyektini göndərir
  } catch (error: any) {
    console.error(`Internship (ID: ${internshipId}) gətirilərkən xəta:`, error);
    console.error("Backend error:", error.response?.data);
    throw error;
  }
};




// services/InternshipServices.ts
export const updateInternship = async (id: number, data: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.patch(`/Internships/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error(`Internship (ID: ${id}) update edilərkən xəta:`, error);
    throw error;
  }
};

// Internship-i bağlamaq (Close)
export const closeInternship = async (internshipId: number) => {
  try {
    const token = localStorage.getItem("token");

    // PATCH metodu olduğu üçün api.patch istifadə edirik.
    // Endpoint body gözləmədiyi üçün ikinci parametr olaraq boş obyekt {} göndəririk.
    const response = await api.patch(`/Internships/${internshipId}/close`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Backend 200 OK qaytarır
  } catch (error: any) {
    console.error(`Internship (ID: ${internshipId}) bağlanarkən xəta:`, error);
    console.error("Backend error:", error.response?.data);
    throw error;
  }
};

// InternshipServices.ts
export const reopenInternship = async (internshipId: number) => {
  try {
    const token = localStorage.getItem("token");

    // Əgər {} xəta verirsə, ikinci parametri null olaraq yoxla
    const response = await api.patch(`/Internships/${internshipId}/reopen`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    // 400 xətasının dəqiq səbəbini görmək üçün:
    console.error("Reopen Error Details:", error.response?.data);
    throw error;
  }
};



// Müəyyən bir internship üzrə gələn müraciətləri gətirmək
export const getInternshipApplications = async (
  internshipId: number, 
  params: {
    Keyword?: string;
    Status?: number; // 0, 1, 2, 3
    IsShortlisted?: boolean;
    page?: number;
    pageSize?: number;
  } = { page: 1, pageSize: 10 }
) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(`/Internships/${internshipId}/applications`, {
      params, // Query parametrləri bura keçirilir (?page=1&pageSize=10 və s.)
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Adətən { items: [], totalCount: 0 } formatında gəlir
  } catch (error: any) {
    console.error(`Internship (ID: ${internshipId}) müraciətləri gətirilərkən xəta:`, error);
    throw error;
  }
};