"use client";

import React, { useEffect, useState } from "react";
import { getCompanyDashboard, getMyCompany } from "@/services/CompanyServices";
import { 
  Briefcase, Users, Clock, AlertCircle, 
  CheckCircle2, XCircle, Calendar, ArrowUpRight,
  TrendingUp, Settings
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- Types ---
interface DashboardData {
  companyName: string;
  totalInternships: number;
  totalApplicationsReceived: number;
  recentInternships: any[];
  recentApplications: any[];
  isApproved: boolean;
  isRejected: boolean;
  rejectionReason?: string;
}

// --- Helper for Date Calculation ---
const formatDaysAgo = (dateString: string) => {
  if (!dateString) return "No date";
  
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Sırf gün müqayisəsi üçün saatı sıfırlayırıq
  
  const past = new Date(dateString);
  const pastDateOnly = new Date(past.getFullYear(), past.getMonth(), past.getDate());
  
  const diffInTime = now.getTime() - pastDateOnly.getTime();
  const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 0) return "Upcoming"; // Gələcək tarix ehtimalı üçün
  return `${diffInDays} days ago`;
};

const CompanyDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [_, dashboardData] = await Promise.all([
          getMyCompany(token),
          getCompanyDashboard(token)
        ]);

        setData(dashboardData);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;

  const status = {
    label: data?.isApproved ? "Active" : data?.isRejected ? "Rejected" : "Pending",
    color: data?.isApproved ? "text-emerald-600 bg-emerald-50 border-emerald-100" : 
           data?.isRejected ? "text-rose-600 bg-rose-50 border-rose-100" : 
           "text-amber-600 bg-amber-50 border-amber-100",
    icon: data?.isApproved ? <CheckCircle2 size={16} /> : 
          data?.isRejected ? <XCircle size={16} /> : <Clock size={16} />
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-indigo-100">
      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${status.color}`}>
              {status.icon} {status.label}
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
               Welcome, {data?.companyName?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 font-medium">Check your company's performance for today.</p>
          </div>
          
          <button 
            onClick={() => router.push("/dashboard/post")}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            + New Posting
          </button>
        </section>

        {/* Rejection Alert */}
        {data?.isRejected && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex gap-5 items-center animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-rose-500 p-3 rounded-2xl text-white shadow-lg shadow-rose-200">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-rose-900 text-lg">Application Rejected</h3>
              <p className="text-rose-700/80 font-medium">{data.rejectionReason || "Please review your company details and try again."}</p>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MetricCard 
            title="Total Postings" 
            value={data?.totalInternships} 
            icon={<Briefcase size={22} />} 
            color="bg-blue-600"

          />
          <MetricCard 
            title="Total Applications" 
            value={data?.totalApplicationsReceived} 
            icon={<Users size={22} />} 
            color="bg-indigo-600"
          />
          <MetricCard 
            title="Active Views" 
            value={data?.recentApplications?.length || 0} 
            icon={<TrendingUp size={22} />} 
            color="bg-emerald-600"

          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content: Recent Postings */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Postings</h2>
              <button 
                onClick={() => router.push("/dashboard/listings")} 
                className="group text-sm font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All <ArrowUpRight size={16} />
              </button>
            </div>

            {data?.recentInternships && data.recentInternships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.recentInternships.map((item: any) => (
                  <InternshipCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState message="No active postings found." />
            )}
          </div>

          {/* Sidebar: Recent Applications */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
              <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-emerald-600 text-[10px] font-black uppercase tracking-wider">Live</span>
              </div>
            </div>
            
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-3">
              {data?.recentApplications && data.recentApplications.length > 0 ? (
                <div className="space-y-2">
                  {data.recentApplications.map((app: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="group flex items-center justify-between p-4 rounded-[2rem] hover:bg-slate-50 transition-all duration-500 cursor-pointer border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-[1.4rem] bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-indigo-200 group-hover:shadow-xl">
                            {app.studentName?.charAt(0) || "U"}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="font-black text-[16px] text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">
                            {app.studentName}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                              <Calendar size={10} strokeWidth={3} />
                              {formatDaysAgo(app.appliedAt)}
                            </span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                              app.status?.toLowerCase() === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              app.status?.toLowerCase() === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                              'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-indigo-600 hover:text-white">
                         <ArrowUpRight size={18} strokeWidth={3} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-slate-400 font-medium">No recent applications.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub-Components ---

const MetricCard = ({ title, value, icon, color, trend }: any) => (
  <div className="relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 group hover:-translate-y-1 transition-all duration-300">
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] rounded-bl-full`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 rounded-2xl text-white shadow-lg ${color}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black bg-slate-50 px-2 py-1 rounded-lg text-slate-500 uppercase tracking-tighter">
        {trend}
      </span>
    </div>
    <div>
      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-1">{title}</p>
      <h2 className="text-4xl font-black text-slate-900 leading-none">{value || 0}</h2>
    </div>
  </div>
);

const InternshipCard = ({ item }: any) => (
  <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/40 hover:border-indigo-100 transition-all duration-300">
    <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight mb-6">
      {item.title}
    </h3>
    
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium bg-slate-50 p-2 rounded-xl">
        <Calendar size={14} className="text-indigo-500" /> 
        {item.startDate?.split('T')[0]} — {item.endDate?.split('T')[0]}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Applicants</p>
          <p className="text-lg font-black text-slate-900">{item.applicationCount || 0}</p>
        </div>
        <button className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <Settings size={18} />
        </button>
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <div className="relative">
      <div className="w-20 h-20 border-[6px] border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
         <div className="w-8 h-8 bg-indigo-100 rounded-full animate-ping" />
      </div>
    </div>
    <p className="mt-6 text-slate-400 font-black tracking-widest animate-pulse uppercase">System Loading</p>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center">
    <div className="bg-white w-20 h-20 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6">
       <Briefcase className="text-slate-300" size={32} />
    </div>
    <p className="text-slate-500 font-bold text-lg">{message}</p>
    <button className="mt-4 text-indigo-600 font-bold text-sm hover:underline">Create your first post</button>
  </div>
);

export default CompanyDashboard;