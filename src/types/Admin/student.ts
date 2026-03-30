// types/Admin/students.ts

export interface GetStudentsParams {
  keyword?: string;
  targetJobId?: number;
  isPremium?: boolean;
  page?: number;
  pageSize?: number;
}

export interface Student {
  id: number;
  username: string;
  email: string;
  fullname: string;
  photoUrl: string | null;
  profileScore: number;
  targetJobName: string;
  isPremium: boolean;
  isBanned: boolean;
}
export interface GetStudentsResponse {
  data: Student[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}


export interface StudentDetail {
  id: number;
  username: string;
  fullname: string;
  email: string;
  photoUrl: string | null;
  isPremium: boolean;
  profileScore: number;
  targetJobName: string | null;
}