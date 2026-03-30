// types/adminDashboard.ts

export interface AdminDashboardResponse {
  applicationsThisWeek: number;
  applicationsToday: number;
  approvedCompanies: number;
  pendingCompanyApprovals: number;
  premiumCompanies: number;
  premiumStudents: number;
  rejectedCompanies: number;
  totalApplications: number;
  totalCompanies: number;
  totalInternships: number;
  totalStudents: number;
  totalUsers: number;
}