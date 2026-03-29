"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApplicationById } from "@/services/Apply";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  PieChart, Pie, Cell 
} from "recharts";
import { 
  FiArrowLeft, FiBriefcase, FiCalendar, FiCpu, 
  FiStar, FiCode, FiExternalLink, 
  FiTarget, FiAward, FiLayers, FiBarChart2
} from "react-icons/fi";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ Hydration Shield: Server və Client arasındakı fərqi aradan qaldırır
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getApplicationById(id);
        setApplication(data);
      } catch (err) {
        console.error("Məlumat yüklənərkən xəta:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Yüklənmə halı və ya Hydration bitənə qədər gözləmə
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full" 
        />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-sm text-center">
          <p className="text-slate-500 font-bold">Məlumat tapılmadı.</p>
          <button onClick={() => router.back()} className="mt-4 text-indigo-600 font-bold underline">Geri qayıt</button>
        </div>
      </div>
    );
  }

  // Chart Data (Təhlükəsiz hesablamalarla)
  const radarData = [
    { subject: 'Match', A: application.matchScore || 0, fullMark: 100 },
    { subject: 'Interview', A: (application.interviewAverageScore || 0) * 5, fullMark: 100 },
    { subject: 'Skills', A: 85, fullMark: 100 },
    { subject: 'Experience', A: (application.experiences?.length || 0) * 20, fullMark: 100 },
    { subject: 'Projects', A: (application.projects?.length || 0) * 15, fullMark: 100 },
  ];

  const gaugeData = [
    { name: "Score", value: application.matchScore || 0 },
    { name: "Remaining", value: 100 - (application.matchScore || 0) },
  ];

  return (
    <div className="min-h-screen bg-[#F5F3FF] pb-20 font-sans">
      {/* ── HEADER ── */}
      <div className="max-w-6xl mx-auto px-6 pt-8 mb-6 flex justify-between items-center">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
          <FiArrowLeft /> Geri
        </button>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-indigo-50">
          <div className={`w-3 h-3 rounded-full animate-pulse ${application.applicationStatus === 'Pending' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">{application.applicationStatus}</span>
        </div>
      </div>

      <div className="max-w-[90%] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Info Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[40px] shadow-sm border border-indigo-50 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-black text-[#1E1B4B] mb-2">{application.internshipTitle}</h1>
              <p className="text-xl font-bold text-indigo-400 mb-6">{application.companyName}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm font-bold bg-slate-50 px-3 py-1.5 rounded-xl">
                  <FiCalendar /> {application.createdAt}
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-bold bg-slate-50 px-3 py-1.5 rounded-xl">
                  <FiTarget /> {application.targetJob}
                </div>
              </div>
            </div>
            <FiBriefcase className="absolute -right-4 -bottom-4 text-indigo-50/50" size={180} />
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[36px] border border-indigo-50 shadow-sm h-[320px]">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiBarChart2 className="text-indigo-500" /> Analitik Görünüş
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} />
                  <Radar name="Namizəd" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-[36px] border border-indigo-50 shadow-sm flex flex-col items-center justify-center relative min-h-[320px]">
               <h3 className="absolute top-6 left-6 text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FiStar className="text-amber-400" /> Uyğunluq dərəcəsi
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={gaugeData} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={90} paddingAngle={0} dataKey="value">
                    <Cell fill="#6366F1" />
                    <Cell fill="#F1F5F9" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center -mt-8">
                <p className="text-4xl font-black text-[#1E1B4B]">{application.matchScore}%</p>
                <p className="text-xs font-bold text-slate-400 uppercase">AI Match Score</p>
              </div>
            </div>
          </div>

          {/* Projects & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
                <h3 className="font-black text-[#1E1B4B] flex items-center gap-2 px-2"><FiLayers className="text-indigo-500"/> Layihələr</h3>
                {application.projects?.length > 0 ? application.projects.map((p:any) => (
                  <div key={p.id} className="bg-white p-5 rounded-3xl border border-indigo-50 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-700">{p.name}</span>
                        {p.projectUrl && <a href={p.projectUrl} target="_blank" rel="noreferrer"><FiExternalLink className="text-indigo-300 hover:text-indigo-600"/></a>}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                  </div>
                )) : <p className="text-xs text-slate-400 px-2 italic">Layihə qeyd edilməyib.</p>}
             </div>
             <div className="space-y-4">
                <h3 className="font-black text-[#1E1B4B] flex items-center gap-2 px-2"><FiAward className="text-indigo-500"/> Təcrübə</h3>
                {application.experiences?.length > 0 ? application.experiences.map((e:any) => (
                  <div key={e.id} className="bg-white p-5 rounded-3xl border border-indigo-50 shadow-sm">
                    <h4 className="font-bold text-slate-700 text-sm">{e.designation}</h4>
                    <p className="text-xs font-bold text-indigo-400">{e.companyName}</p>
                  </div>
                )) : <p className="text-xs text-slate-400 px-2 italic">Təcrübə qeyd edilməyib.</p>}
             </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Feedback */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <FiCpu className="text-indigo-400 animate-pulse" size={20} />
                <span className="text-xs font-black uppercase tracking-widest text-indigo-300">AI Təhlili</span>
              </div>
              <p className="text-sm leading-relaxed text-indigo-100/90 font-medium italic">
                "{application.aiMatchFeedback || "Feedback hazır deyil."}"
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full" />
          </motion.div>

          {/* Technical Skills */}
          <div className="bg-white p-8 rounded-[40px] border border-indigo-50 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
              <FiCode className="text-indigo-500" size={14}/> Texniki Bacarıqlar
            </h3>
            <div className="flex flex-wrap gap-2">
              {application.skills?.map((s:string) => (
                <span key={s} className="px-4 py-2 bg-indigo-50/50 text-indigo-600 rounded-2xl text-[11px] font-black border border-indigo-100/50 hover:bg-indigo-50 transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Student Profile */}
          <div className="bg-white p-8 rounded-[40px] border border-indigo-50 shadow-sm text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-[38%] mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-100">
              {application.fullName?.charAt(0)}
            </div>
            <h4 className="text-lg font-black text-[#1E1B4B]">{application.fullName}</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {application.applicationId}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page;