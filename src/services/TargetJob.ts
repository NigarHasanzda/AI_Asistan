import api, { getToken, logApiError } from "@/services/api";
import { TargetJob } from "@/types/targetjob";

/** Target job siyahısı. Token yoxdursa və ya xəta olarsa boş array qaytarır. */
export const GetTargetJobs = async (): Promise<TargetJob[]> => {
  if (!getToken()) return [];

  try {
    const { data } = await api.get<TargetJob[]>("/TargetJobs");
    return data;
  } catch (error) {
    logApiError("Error fetching target jobs:", error);
    return [];
  }
};
