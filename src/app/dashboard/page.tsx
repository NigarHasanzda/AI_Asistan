"use client";

import React, { useEffect, useState } from "react";
import { getCompanyDashboard, getMyCompany } from "@/services/CompanyServices";
import { 
  Briefcase, Users, Clock, AlertCircle, 
  CheckCircle2, XCircle, Calendar, ArrowUpRight,
  TrendingUp, LayoutDashboard, Settings, Bell
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
    label: data?.isApproved ? "Aktiv" : data?.isRejected ? "İmtina" : "Gözləmədə",
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
               Xoş gəldiniz, {data?.companyName?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 font-medium">Bu gün üçün şirkətinizin statistikasına nəzər salın.</p>
          </div>
          
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95">
            + Yeni Proqram
          </button>
        </section>

        {/* Status Alert for Rejection */}
        {data?.isRejected && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex gap-5 items-center animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-rose-500 p-3 rounded-2xl text-white shadow-lg shadow-rose-200">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-rose-900 text-lg">Müraciətiniz qəbul edilmədi</h3>
              <p className="text-rose-700/80 font-medium">{data.rejectionReason || "Zəhmət olmasa məlumatları yenidən yoxlayın."}</p>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MetricCard 
            title="Ümumi Proqramlar" 
            value={data?.totalInternships} 
            icon={<Briefcase size={22} />} 
            color="bg-blue-600"
            trend="+12%"
          />
          <MetricCard 
            title="Müraciətlər" 
            value={data?.totalApplicationsReceived} 
            icon={<Users size={22} />} 
            color="bg-indigo-600"
            trend="+24%"
          />
          <MetricCard 
            title="Aktiv Baxış" 
            value={data?.recentApplications?.length || 0} 
            icon={<TrendingUp size={22} />} 
            color="bg-emerald-600"
            trend="Stabil"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content: Recent Internships */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold text-slate-900">Son Proqramlar</h2>
              <button 
              onClick={()=>router.push("/dashboard/listings")} className="group text-sm font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                Hamısı <ArrowUpRight size={16} />
              </button>
            </div>

            {data?.recentInternships && data.recentInternships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.recentInternships.map((item: any) => (
                  <InternshipCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState message="Hələ ki, aktiv proqramınız yoxdur." />
            )}
          </div>

          {/* Sidebar: Recent Activity */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 px-2">Son Müraciətlər</h2>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 p-6 overflow-hidden">
              {data?.recentApplications && data.recentApplications.length > 0 ? (
                <div className="space-y-5">
                  {data.recentApplications.map((app: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {app.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">{app.name || "Namizəd"}</p>
                          <p className="text-[11px] text-slate-400 font-medium">2 dəqiqə əvvəl</p>
                        </div>
                      </div>
                      <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ArrowUpRight size={14} className="text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-10 text-slate-400 text-sm italic">Müraciət yoxdur.</p>
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
  <div className="relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 group hover:translate-y-[-4px] transition-all">
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
  <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/40 hover:border-indigo-100 transition-all">
    <div className="flex justify-between items-start mb-6">
      <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
        {item.title}
      </h3>
    </div>
    
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium bg-slate-50 p-2 rounded-xl">
        <Calendar size={14} className="text-indigo-500" /> 
        {item.startDate} — {item.endDate}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Müraciət</p>
          <p className="text-lg font-black text-slate-900">{item.applicationCount}</p>
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
    <p className="mt-6 text-slate-400 font-bold tracking-widest animate-pulse">SİSTEM YÜKLƏNİR</p>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center">
    <div className="bg-white w-20 h-20 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6">
       <Briefcase className="text-slate-300" size={32} />
    </div>
    <p className="text-slate-500 font-bold text-lg">{message}</p>
    <button className="mt-4 text-indigo-600 font-bold text-sm hover:underline">İlk elanı yarat</button>
  </div>
);

export default CompanyDashboard;