"use client";

import React, { useEffect, useState } from "react";
import { getCompanyDashboard, getMyCompany } from "@/services/CompanyServices";
import {
  Briefcase, Users, Clock, AlertCircle,
  CheckCircle2, XCircle, Calendar, ArrowUpRight,
  TrendingUp, Settings, ShieldAlert, RefreshCw, XCircle as CloseIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

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

const formatDaysAgo = (dateString: string) => {
  if (!dateString) return "No date";
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const past = new Date(dateString);
  const pastDateOnly = new Date(past.getFullYear(), past.getMonth(), past.getDate());
  const diffInDays = Math.round((now.getTime() - pastDateOnly.getTime()) / (1000 * 3600 * 24));
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  return `${diffInDays} days ago`;
};

const CompanyDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  console.log(data);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const [_, dashboardData] = await Promise.all([
          getMyCompany(token),
          getCompanyDashboard(token)
        ]);

        setData(dashboardData);

        // Pending toast (Yalnız təsdiq gözləyəndə)
        if (dashboardData && !dashboardData.isApproved && !dashboardData.isRejected) {
          toast.error("Admin tərəfindən təsdiq gözlənilir!", {
            duration: 6000,
            style: {
              padding: '24px',
              color: '#92400e',
              background: '#fffbeb',
              border: '2px solid #f59e0b',
              fontWeight: '900',
              fontSize: '18px',
              borderRadius: '24px',
              minWidth: '400px'
            },
            icon: <Clock size={32} className="text-amber-500 animate-spin" />,
          });
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <LoadingSkeleton />;

  // --- ❌ RƏDD EDİLMİŞ ŞİRKƏT ÜÇÜN EKRAN (isRejected: true) ---
  if (data && data.isRejected) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="max-w-2xl w-full bg-rose-50/50 border-2 border-rose-100 rounded-[3.5rem] p-12 md:p-20 space-y-8 shadow-2xl shadow-rose-100/30 animate-in zoom-in-95 duration-500">
          <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl border border-rose-100">
            <XCircle className="text-rose-500" size={60} />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Admin tərəfindən <br /> <span className="text-rose-600">təsdiqlənmədiniz</span>
            </h1>
            <p className="text-lg text-slate-600 font-bold leading-relaxed">
              Ona görə platformadan istifadə edə bilməzsiniz.
            </p>
            {data.rejectionReason && (
              <div className="mt-6 p-6 bg-white border border-rose-100 rounded-3xl">
                <p className="text-xs text-rose-400 font-black uppercase tracking-widest mb-2">Rədd Səbəbi:</p>
                <p className="text-rose-700 font-bold text-lg leading-snug italic italic">"{data.rejectionReason}"</p>
              </div>
            )}
          </div>
          <p className="text-slate-400 text-sm font-medium">Daha ətraflı məlumat üçün dəstək komandası ilə əlaqə saxlayın.</p>
        </div>
      </div>
    );
  }

  // --- ⚠️ TƏSDİQ GÖZLƏYƏN ŞİRKƏT ÜÇÜN EKRAN (isApproved: false) ---
  if (data && !data.isApproved) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <Toaster position="top-center" />
        <div className="max-w-2xl w-full bg-amber-50/50 border-2 border-amber-100 rounded-[3.5rem] p-12 md:p-20 text-center space-y-8 shadow-2xl shadow-amber-100/30 animate-in zoom-in-95 duration-500">
          <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl border border-amber-100">
            <ShieldAlert className="text-amber-500 animate-bounce" size={56} />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Təsdiq <span className="text-amber-600">Gözlənilir</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 font-bold leading-relaxed">
              Admin tərəfindən təsdiqlənmədiyiniz üçün platformadan istifadə edə bilməzsiniz, Adminden cavab gözləyin.
            </p>
          </div>
          <button onClick={() => window.location.reload()} className="flex items-center gap-3 bg-white border-2 border-amber-200 text-amber-700 px-8 py-4 rounded-2xl font-black hover:bg-amber-100 transition-all active:scale-95 shadow-sm mx-auto">
            <RefreshCw size={20} /> Statusu Yenilə
          </button>
        </div>
      </div>
    );
  }

  const status = {
    label: "Active",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    icon: <CheckCircle2 size={16} />
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-indigo-100">
      <Toaster position="top-right" />
      <main className="max-w-[95%] mx-auto p-4 md:p-6 space-y-10">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${status.color}`}>
              {status.icon} {status.label}
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Welcome, {data?.companyName?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 font-medium text-lg">Check your company's performance for today.</p>
          </div>
          <button onClick={() => router.push("/dashboard/post")} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
            + New Posting
          </button>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MetricCard title="Total Postings" value={data?.totalInternships} icon={<Briefcase size={22} />} color="bg-blue-600" trend="+2 new" />
          <MetricCard title="Total Applications" value={data?.totalApplicationsReceived} icon={<Users size={22} />} color="bg-indigo-600" trend="Active" />
          <MetricCard title="Recent Applications" value={data?.recentApplications?.length} icon={<TrendingUp size={22} />} color="bg-emerald-600" trend="Live" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Postings</h2>
              <button onClick={() => router.push("/dashboard/listings")} className="group text-sm font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                View All <ArrowUpRight size={16} />
              </button>
            </div>
            {data?.recentInternships && data.recentInternships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.recentInternships.slice(0, 4).map((item: any) => (
                  <InternshipCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState message="No active postings found." />
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
              <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-600 text-[10px] font-black uppercase tracking-wider">Live</span>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
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
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${app.status?.toLowerCase() === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                app.status?.toLowerCase() === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                  'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div onClick={()=>router.push(`dashboard/applicant/${app.id}`)} className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-indigo-600 hover:text-white">
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
      <span className="text-[10px] font-black bg-slate-50 px-2 py-1 rounded-lg text-slate-500 uppercase tracking-tighter">{trend}</span>
    </div>
    <div>
      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-1">{title}</p>
      <h2 className="text-5xl font-black text-slate-900 leading-none tracking-tighter">{value || 0}</h2>
    </div>
  </div>
);

const InternshipCard = ({ item }: any) => (
  <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300">
    <h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight mb-6">{item.title}</h3>
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-500 font-bold bg-slate-50 p-3 rounded-xl">
        <Calendar size={14} className="text-indigo-500" /> {item.startDate?.split('T')[0]} — {item.endDate?.split('T')[0]}
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Applicants</p>
          <p className="text-2xl font-black text-slate-900">{item.applicationCount || 0}</p>
        </div>
        <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <Settings size={20} />
        </button>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ app, formatDaysAgo }: any) => (
  <div className="group flex items-center justify-between p-4 rounded-[2rem] hover:bg-slate-50 transition-all duration-500 cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
        {app.studentName?.charAt(0) || "U"}
      </div>
      <div className="space-y-1">
        <p className="font-black text-[16px] text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">{app.studentName}</p>
        <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1"><Calendar size={10} /> {formatDaysAgo(app.appliedAt)}</span>
      </div>
    </div>
    <ArrowUpRight size={18} className="text-slate-200 group-hover:text-indigo-600" />
  </div>
);

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 border-8 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
    <p className="text-slate-400 font-black tracking-widest uppercase">System Loading</p>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="bg-slate-50/50 border-4 border-dashed border-slate-100 rounded-[3rem] p-20 text-center">
    <Briefcase className="text-slate-300 mx-auto mb-6" size={48} />
    <p className="text-slate-500 font-black text-xl">{message}</p>
  </div>
);

export default CompanyDashboard;