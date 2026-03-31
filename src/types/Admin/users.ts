// types/admin.ts

export interface AdminUser {
  id: number;
  fullname: string;
  email: string;
  isProfileCompleted: boolean;
  isBanned: boolean;
  photoUrl?: string;
}

export interface GetUsersParams {
  keyword?: string;
  isProfileCompleted?: boolean;
  isBanned?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}