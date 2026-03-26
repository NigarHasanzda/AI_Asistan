import api from "@/libs/api";
import { TargetJob } from "@/types/targetjob";


export const GetTargetJobs = async (): Promise<TargetJob[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return []; // token yoxdursa, boş array qaytar

    const res = await api.get("/TargetJobs", {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data; // Backend res.data array qaytarmalıdır
  } catch (err) {
    console.error("Error fetching target jobs:", err);
    return [];
  }
};