// services/UpdateStudent.ts
import api from "@/libs/api";

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