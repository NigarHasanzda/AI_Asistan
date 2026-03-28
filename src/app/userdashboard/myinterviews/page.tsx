"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyInterviews, getStreak } from "@/services/MockInterview";
import {
  Briefcase,
  BarChart3,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Flame,
  Sparkles,
  ArrowRight
} from "lucide-react";
import api from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

interface Interview {
  id: number;
  role?: string;
  name: string;
  mode?: string;
  level?: string;
  isCompleted?: boolean;
  averageScore?: number;
  targetJobName?: string;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
   practicedToday: boolean;

}

const Page: React.FC = () => {
  const router = useRouter();
  const [allInterviews, setAllInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [page, setPage] = useState(1);
  console.log(allInterviews)
  const pageSize = 9;

  useEffect(() => {
    getStreak().then(setStreak).catch(console.error);
  }, []);

  useEffect(() => {
    fetchInterviews(page);
  }, [page]);

  const fetchInterviews = async (pageNumber: number) => {
    try {
      setLoading(true);
      const data = await getMyInterviews({ page: pageNumber, pageSize });
      console.log(data);
      setAllInterviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  

  const handleRetry = async (id: number) => {
    try {
      const response = await api.post(`/MockInterviews/my-interviews/${id}/retry`, null);
      router.push(`/userdashboard/interviews/${response.data}`);
    } catch (err) {
      router.push(`/userdashboard/interviews/${id + 1000}`);
    }
  };

  // ✅ Dinamik Yönləndirmə Funksiyası
  const handleCardClick = (i: Interview) => {
    if (i.isCompleted) {
      // Tamamlanıbsa detail səhifəsinə
      router.push(`/userdashboard/interviews/${i.id}/detail`);
    } else {
      // Tamamlanmayıbsa intervyu sessiyasına
      router.push(`/userdashboard/interviews/${i.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-100/40 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wide uppercase">
              <Sparkles size={14} /> My Learning Journey
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
              Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Archive</span>
            </h1>
            <p className="text-slate-500 font-medium">Track your progress and master your next big career move.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-2 rounded-2xl border border-white shadow-xl shadow-slate-200/50"
          >
            <div className="flex flex-col px-4 py-2 bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Current Streak</span>
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-orange-500 fill-orange-500" />
                <span className="text-xl font-black text-slate-800">{streak?.currentStreak ?? 0}</span>
              </div>
            </div>
            <div className="flex flex-col px-4 py-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Longest Streak</span>
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-indigo-600" />
                <span className="text-xl font-black text-slate-800">{streak?.longestStreak ?? 0}</span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* MAIN CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-400 font-bold text-sm animate-pulse tracking-widest uppercase">Fetching Data...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {allInterviews.map((i, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={i.id}
                  onClick={() => handleCardClick(i)} // ✅ Yenilənmiş klik funksiyası
                  className={`group relative bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer overflow-hidden ${
                    !i.isCompleted ? 'ring-2 ring-indigo-500 ring-offset-4 ring-offset-[#f8fafc]' : ''
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -z-10 transition-transform group-hover:scale-150 duration-700" />

                  <div className="flex justify-between items-center mb-8">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${
                      i.isCompleted 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-indigo-600 text-white animate-pulse"
                    }`}>
                      {i.isCompleted ? "Completed" : "Active Now"}
                    </span>
                    <span className="text-xs font-bold text-slate-300">#{i.id}</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                      {i.name}
                    </h3>
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Briefcase size={16} />
                      </div>
                      <span className="font-semibold text-sm">{i.targetJobName || "General Practice"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Expertise</p>
                      <p className="text-sm font-bold text-slate-700">{i.level}</p>
                    </div>
                    <div className="bg-slate-50/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Format</p>
                      <p className="text-sm font-bold text-slate-700">{i.mode}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    {i.isCompleted ? (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                          <BarChart3 className="text-emerald-600" size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Score</p>
                          <p className="text-2xl font-black text-slate-800">{i.averageScore}%</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-indigo-600 font-extrabold group/btn">
                        Resume Session 
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    )}

                    {i.isCompleted && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRetry(i.id); }}
                        className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:rotate-180 transition-all duration-500 active:scale-90 shadow-lg"
                      >
                        <RotateCcw size={20} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ✅ SMART PAGINATION - Səhifə sayına görə özünü tənzimləyir */}
        {!loading && (allInterviews.length > 0 || page > 1) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-[28px] shadow-xl shadow-slate-200/40">
              <button
                onClick={() => {
                    setPage((prev) => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === 1}
                className="w-14 h-14 flex items-center justify-center rounded-2xl transition-all hover:bg-indigo-50 text-slate-600 disabled:opacity-20 group"
              >
                <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center px-6 border-x border-slate-100">
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-xl shadow-lg shadow-indigo-200">
                  {page}
                </div>
              </div>

              <button
                onClick={() => {
                    setPage((prev) => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={allInterviews.length < pageSize}
                className="w-14 h-14 flex items-center justify-center rounded-2xl transition-all hover:bg-indigo-50 text-slate-600 disabled:opacity-20 group"
              >
                <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
              {allInterviews.length < pageSize ? "End of Archive" : "Continue Exploring"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Page;

