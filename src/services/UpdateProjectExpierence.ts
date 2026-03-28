// services/UpdateStudent.ts
import api from "@/services/api";

// --- UPDATE EXPERIENCE ---
export const updateExperience = async (id: number, data: {
  companyName: string;
  designation: string;
  startDate: string;
  endDate: string;
  description: string;
}) => {
  const token = localStorage.getItem("token") || "";
  const response = await api.patch(`/Experiences/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// --- UPDATE PROJECT ---
export const updateProject = async (id: number, data: {
  name: string;
  description: string;
  projectUrl: string;
}) => {
  const token = localStorage.getItem("token") || "";
  const response = await api.patch(`/Projects/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// --- DELETE PROJECT SKILL ---
export const deleteProjectSkill = async (projectId: number, skillId: number) => {
  const token = localStorage.getItem("token") || "";
  const response = await api.delete(`/Projects/${projectId}/skills/${skillId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};