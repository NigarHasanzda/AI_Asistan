import api from "@/services/api";

// ---------- Experience ----------

export const updateExperience = async (
  id: number,
  data: {
    companyName: string;
    designation: string;
    startDate: string;
    endDate: string;
    description: string;
  }
) => (await api.patch(`/Experiences/${id}`, data)).data;

export const deleteExperience = async (id: number) =>
  (await api.delete(`/Experiences/${id}`)).data;

// ---------- Project ----------

export const updateProject = async (
  id: number,
  data: {
    name: string;
    description: string;
    projectUrl: string;
  }
) => (await api.patch(`/Projects/${id}`, data)).data;

export const deleteProject = async (id: number) =>
  (await api.delete(`/Projects/${id}`)).data;

export const deleteProjectSkill = async (projectId: number, skillId: number) =>
  (await api.delete(`/Projects/${projectId}/skills/${skillId}`)).data;
