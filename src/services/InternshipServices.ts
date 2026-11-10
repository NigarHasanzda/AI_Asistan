import api, { isBrowser, JSON_HEADERS, logApiError, request, requireToken } from "@/services/api";
import { CreateInternshipDto } from "@/types/internship";
import { MatchedInternshipParams } from "@/types/Student";

// ---------- Company: internship CRUD ----------

export const createInternship = async (data: CreateInternshipDto) =>
  request("Internship yaradılarkən xəta:", () => api.post("/Internships", data));

/** Şirkətin internship-ləri. Xəta olarsa boş array qaytarır. */
export const getCompanyInternships = async (params: any = {}) => {
  try {
    const { data } = await api.get("/Companies/internships", { params });
    return data;
  } catch (error) {
    logApiError("Internships gətirilərkən xəta:", error);
    return [];
  }
};

export const addSkillToInternship = async (internshipId: number, skill: string) => {
  // Backend body-ni JSON string kimi gözləyir: "React"
  const { data } = await api.post(
    `/Internships/${internshipId}/skills`,
    JSON.stringify(skill),
    { headers: JSON_HEADERS }
  );
  return data;
};

export const deleteInternship = async (internshipId: number) =>
  request("Internship silinərkən xəta:", () => api.delete(`/Internships/${internshipId}`));

export const getInternshipById = async (internshipId: number) =>
  request(`Internship (ID: ${internshipId}) gətirilərkən xəta:`, () =>
    api.get(`/Internships/${internshipId}`)
  );

export const updateInternship = async (id: number, data: any) =>
  request(`Internship (ID: ${id}) update edilərkən xəta:`, () =>
    api.patch(`/Internships/${id}`, data)
  );

export const closeInternship = async (internshipId: number) =>
  request(`Internship (ID: ${internshipId}) bağlanarkən xəta:`, () =>
    api.patch(`/Internships/${internshipId}/close`, {})
  );

export const reopenInternship = async (internshipId: number) =>
  request("Reopen Error Details:", () =>
    api.patch(`/Internships/${internshipId}/reopen`, null)
  );

/** Bir internship üzrə müraciətlər (filter + pagination). */
export const getInternshipApplications = async (
  internshipId: number,
  params: {
    Keyword?: string;
    Status?: number; // 0, 1, 2, 3
    IsShortlisted?: boolean;
    page?: number;
    pageSize?: number;
  } = { page: 1, pageSize: 10 }
) =>
  request(`Internship (ID: ${internshipId}) müraciətləri gətirilərkən xəta:`, () =>
    api.get(`/Internships/${internshipId}/applications`, { params })
  );

// ---------- Student ----------

export const getMatchedInternships = async (params: MatchedInternshipParams = {}) => {
  if (!isBrowser()) return null;
  requireToken();

  return request("Internships alınarkən xəta:", () =>
    api.get("/Students/matched-internships", { params })
  );
};

export const startPracticeInterview = async (internshipId: number) => {
  if (!isBrowser()) return null;
  requireToken();

  return request("Practice interview error:", () =>
    api.post(`/MockInterviews/practice/${internshipId}`, {})
  );
};
