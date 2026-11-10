import { StudentDetail } from "@/types/Admin/student";
import api, { request } from "../api";

/** Tələbələr (filter + pagination). */
export const getAdminStudents = async (params?: any) =>
  request("Get Students Error:", () =>
    api.get("/Admin/students", {
      params: {
        Keyword: params?.keyword,
        TargetJobId: params?.targetJobId,
        IsPremium: params?.isPremium,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
      },
    })
  );

export const getStudentById = async (id: number): Promise<StudentDetail> =>
  request<StudentDetail>("Get Student By ID Error:", () => api.get(`/Admin/students/${id}`));
