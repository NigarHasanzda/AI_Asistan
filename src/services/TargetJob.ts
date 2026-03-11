import api from "@/libs/api";
import { TargetJob } from "@/types/targetjob";


export const GetTargetJobs = async (): Promise<TargetJob[]> => {
  const res = await api.get("/TargetJobs");
  return res.data;
};