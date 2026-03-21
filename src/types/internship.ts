// types.ts

export interface CreateInternshipDto {
  title: string;
  description: string;
  isPaid: boolean;
  locationType: number; // 0 = onsite, 1 = remote, 2 = hybrid
  startDate: string; // ISO string
  endDate: string;   // ISO string
  departmentId: number;
  deadlineDate: string; // ISO string
}

export interface Internship {
  id: number;
  title: string;
  description: string;
  isPaid: boolean;
  locationType: number; // 0,1,2
  startDate: string;
  endDate: string;
  departmentId: number;
  deadlineDate: string;
  isClosed: boolean;
}

export interface GetInternshipsParams {
  keyword?: string;
  locationType?: number; // 0,1,2
  isPaid?: boolean;
  isClosed?: boolean;
  page?: number;
  pageSize?: number;
}



 export interface InternshipCardProps {
  title: string;
  applicants: number;
  progress: number;
}