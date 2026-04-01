"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { 
  FiBriefcase, FiVideo, FiClock, 
  FiXCircle, FiTarget, FiZap, FiAlertCircle, 
  FiTrendingUp, FiArrowRight, FiExternalLink, FiLoader
} from "react-icons/fi";

import { analyzeProfile, getStudentDashboard } from "@/services/StudentProfile";
import { getStreak } from "@/services/MockInterview";
import { useRouter } from "next/navigation";

ChartJS.register(ArcElement, Tooltip, Legend);

const Page = () => {
  const [profile, setProfile] = useState<any>(null);
  console.log(profile);
  
  const [streak, setStreak] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = async (isInitial = true) => {
    if (!isInitial) setRefreshing(true);
    try {
      const [profileData, streakData, dashboardData] = await Promise.all([
        analyzeProfile(),
        getStreak(),
        getStudentDashboard()
      ]);
      
      setProfile(profileData);
      setStreak(streakData);
      setDashboard(dashboardData);

      // Toast message based on Streak status
      if (streakData) {
        if (streakData.practicedToday) {
          setToast("You have completed your daily interview goal! 🎉");
        } else {
          setToast("Your daily interview goal is waiting! 🔔");
        }
      }
    } catch (err: any) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const chartData = useMemo(() => ({
    datasets: [{
      data: [profile?.score || 0, 100 - (profile?.score || 0)],
      backgroundColor: ["#4f46e5", "rgba(226, 232, 240, 0.5)"],
      borderWidth: 0,
      borderRadius: 20,
      cutout: "82%",
    }],
  }), [profile?.score]);

  const handleRefreshAnalysis = () => {
    fetchData(false);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 p-4 md:p-10 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Premium Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-8 right-8 px-6 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[100] flex items-center gap-4 bg-white border border-slate-100/50 backdrop-blur-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FiZap className="w-5 h-5 fill-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Notification</p>
              <p className="text-sm font-bold text-slate-800">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-8 bg-indigo-600 rounded-full" />
              <h1 className="text-4xl font-black text-slate-950 tracking-tight">KORD <span className="text-indigo-600">AI</span></h1>
            </div>
            <p className="text-slate-500 font-medium">Welcome, <span className="text-slate-950">{dashboard?.fullname}</span>. Your profile analysis is ready.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
            <div className="px-5 py-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Streak</p>
              <p className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FiZap className={streak?.practicedToday ? "text-orange-500 fill-orange-500" : "text-slate-300"} /> 
                {dashboard?.currentStreak} DAYS
              </p>
            </div>
            <div className="h-10 w-[1px] bg-slate-100" />
            <div className="px-5 py-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</p>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${dashboard?.isPremium ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                {dashboard?.isPremium ? 'Premium' : 'Standard'}
              </span>
            </div>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* AI Insights & Score */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="lg:col-span-8 bg-white rounded-[40px] p-10 border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <FiTarget size={200} />
            </div>

            <div className="flex flex-col xl:flex-row items-center gap-12 relative z-10">
              <div className="relative w-52 h-52 flex-shrink-0">
                <Doughnut data={chartData} options={{ maintainAspectRatio: false, plugins: { tooltip: { enabled: false } } }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-slate-950 tracking-tighter">{profile?.score}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Score</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-950">AI Profile Analysis</h2>
                  <p className="text-slate-500 leading-relaxed font-medium italic">"{profile?.feedback}"</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Strengths</p>
                      <p className="text-xs font-bold text-slate-700">{profile?.strengths?.length > 0 ? profile.strengths[0] : "Analysis pending..."}</p>
                   </div>
                   <div className="bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/30">
                      <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Next Step</p>
                      <p className="text-xs font-bold text-indigo-900">{profile?.improvementSteps?.[0]}</p>
                   </div>
                </div>

                <button 
                  onClick={handleRefreshAnalysis}
                  disabled={refreshing}
                  className="flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all hover:shadow-xl hover:shadow-indigo-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {refreshing ? <FiLoader className="animate-spin" /> : null}
                  {refreshing ? "Updating Analysis..." : "Refresh Full Analysis"} <FiArrowRight />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="lg:col-span-4 space-y-6">
             <StatCard label="Total Applications" value={dashboard?.totalApplications} sub="Career Center" icon={<FiBriefcase />} color="indigo" />
             <StatCard label="Interview Sessions" value={dashboard?.totalInterviews} sub={`Avg. ${dashboard?.averageInterviewScore.toFixed(1)} Score`} icon={<FiVideo />} color="orange" />
             
             <div className="bg-slate-900 p-8 rounded-[32px] text-white overflow-hidden relative group">
                <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform">
                   <FiClock size={120} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending</p>
                <h4 className="text-4xl font-black mb-2 flex items-baseline gap-2">
                   {dashboard?.pendingApplications}
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Apps</span>
                </h4>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mt-4">
                  <FiLoader className="animate-spin" /> Awaiting response...
                </div>
             </div>
          </div>

          {/* Detailed Skill Analysis */}
          <div className="lg:col-span-12 grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FiAlertCircle className="text-red-500" /> Critical Gaps
              </h3>
              <div className="space-y-5">
                {profile?.missingSkills?.map((skill: string, i: number) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{skill}</span>
                      <span className="text-red-500">!</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "25%" }} className="h-full bg-red-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FiTrendingUp className="text-indigo-600" /> Improvement Plan
              </h3>
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2.5 before:h-full before:w-0.5 before:bg-slate-50">
                {profile?.improvementSteps?.map((step: string, i: number) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className="mt-1 h-5 w-5 rounded-full border-4 border-white bg-indigo-600 shadow-sm z-10" />
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FiXCircle className="text-slate-400" /> Weak Points
              </h3>
              <div className="space-y-3">
                {profile?.weaknesses?.map((w: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <p className="text-xs font-bold text-slate-600">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-slate-950 text-xs uppercase tracking-widest">Recent Activity</h3>
                <button className="text-[10px] font-black text-indigo-600 hover:underline tracking-widest">VIEW ALL</button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                         <th className="px-8 py-4">Position</th>
                         <th className="px-8 py-4">Company</th>
                         <th className="px-8 py-4">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-sm">
                      {dashboard?.recentApplications?.map((app: any) => (
                        <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-5 font-bold text-slate-900">{app.internshipTitle}</td>
                           <td className="px-8 py-5 text-slate-500 font-medium">{app.companyName}</td>
                           <td className="px-8 py-5">
                              <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-tighter border border-orange-100">
                                {app.status}
                              </span>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Saved Internships */}
          <div className="lg:col-span-4 bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
             <h3 className="font-black text-slate-950 text-xs uppercase tracking-widest mb-8">Saved Internships</h3>
             <div className="space-y-6">
                {dashboard?.savedInternships?.map((intern: any) => (
                  <div key={intern.internshipId} className="group cursor-pointer">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{intern.title}</p>
                           <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">{intern.companyName}</p>
                        </div>
                        <FiExternalLink onClick={()=>router.push(`userdashboard/internships/${intern.internshipId}`)} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
                     </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ label, value, sub, icon, color }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-indigo-100 transition-all group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${
      color === 'indigo' ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 
      'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
    }`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-950">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 mt-1">{sub}</p>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#FDFDFF] p-10 flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Loading...</p>
    </div>
  </div>
);

export default Page;