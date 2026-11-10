import api, { isBrowser, request, requireToken, withAuth } from "@/services/api";

export const GetStudentProfile = async (token: string) =>
  request("Get profile error:", () => api.get("/Students/get-profile", withAuth(token)));

export const analyzeProfile = async () => {
  if (!isBrowser()) return null;
  requireToken();

  return request("Profil analizi zamanı xəta:", () => api.get("/Students/analyze-profile"));
};

export const getStudentDashboard = async () => {
  if (!isBrowser()) return null;
  requireToken();

  return request("Dashboard əldə edilərkən xəta:", () => api.get("/Students/dashboard"));
};

export const updateFullStudentProfile = async (profileData: FormData) => {
  if (!isBrowser()) return null;
  requireToken();

  // Content-Type yazılmır — axios FormData üçün multipart/form-data-nı özü qoyur
  return request("Profil yenilənərkən xəta:", () =>
    api.patch("/Students/update-profile", profileData)
  );
};

export const deleteStudentSkill = async (skillId: number) => {
  if (!isBrowser()) return null;
  requireToken();

  return request("Skill silinərkən xəta:", () => api.delete(`/Students/${skillId}`));
};
