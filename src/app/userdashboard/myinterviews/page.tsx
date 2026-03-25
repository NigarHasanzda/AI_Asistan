"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyInterviews, getStreak } from "@/services/MockInterview";
import {
  Briefcase,
  BarChart3,
  RotateCcw,
  ChevronRight,
  Trophy,
  Flame,
  LayoutGrid
} from "lucide-react";
import api from "@/libs/api";

interface Interview {
  id: number;
  role?: string;
  mode?: string;
  level?: string;
  isCompleted?: boolean;
  averageScore?: number;
  targetJobName?: string;
}

interface Streak {
  currentStreak: number;
  longestStreak: number;
}

const Page: React.FC = () => {
  const router = useRouter();

  const [allInterviews, setAllInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState<Streak | null>(null);

  // ✅ Pagination state
  const [page, setPage] = useState(1);
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

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10">
      <div className="max-w-[95%] mx-auto">

        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
          <div className="space-y-1">
            {/* <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
              <LayoutGrid size={16} />
              Personal Dashboard
            </div> */}
            <h1 className="text-4xl font-black text-slate-900">
              Interviews <span className="text-indigo-600">Archive</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl border border-orange-100">
              <Flame size={18} className="text-orange-500" fill="currentColor" />
              <span className="font-bold text-slate-700">{streak?.currentStreak ?? 0}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
              <Trophy size={18} className="text-indigo-600" />
              <span className="font-bold text-slate-700">{streak?.longestStreak ?? 0}</span>
            </div>
          </div>
        </div>

        {/* GRID LAYOUT */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {allInterviews.map((i) => (
                <div
                  key={i.id}
                  onClick={() => !i.isCompleted && router.push(`/userdashboard/interviews/${i.id}`)}
                  className="group relative bg-white border border-slate-200 rounded-[28px] p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                >
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${i.isCompleted ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                      }`}>
                      {i.isCompleted ? "Completed" : "In Progress"}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 tracking-tighter">#ID-{i.id}</span>
                  </div>

                  {/* Role & Level */}
                  <div className="mb-6">
                    <h3 className="text-xl font-extrabold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {i.role || "General Interview"}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 flex items-center gap-2 mt-1">
                      <Briefcase size={14} /> {i.targetJobName || "No Company"}
                    </p>
                  </div>

                  {/* Middle Info Section */}
                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl mb-6">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400">Level</p>
                      <p className="text-xs font-bold text-slate-700">{i.level}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400">Mode</p>
                      <p className="text-xs font-bold text-slate-700">{i.mode}</p>
                    </div>
                  </div>

                  {/* Score or Action */}
                  <div className="flex items-center justify-between mt-auto">
                    {i.isCompleted ? (
                      <div className="flex items-center gap-2">
                        <div className="bg-emerald-500/10 p-2 rounded-lg">
                          <BarChart3 size={18} className="text-emerald-600" />
                        </div>
                        <span className="text-2xl font-black text-slate-800">{i.averageScore}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-indigo-600 font-bold text-sm">
                        Continue <ChevronRight size={16} />
                      </div>
                    )}

                    {i.isCompleted && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRetry(i.id); }}
                        className="p-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all active:scale-90"
                        title="Retry"
                      >
                        <RotateCcw size={18} />
                      </button>
                    )}
                  </div>

                  {/* Bottom Border Accent */}
                  <div className={`absolute bottom-0 left-10 right-10 h-1 rounded-t-full transition-all duration-300 ${i.isCompleted ? "bg-emerald-500 opacity-30 group-hover:opacity-100" : "bg-indigo-500 opacity-30 group-hover:opacity-100"
                    }`} />
                </div>
              ))}
            </div>

            {/* ✅ MODERN PAGINATION */}
            {!loading && allInterviews.length > 0 && (
              <div className="mt-16 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-2xl shadow-sm">

                  {/* Prev Button */}
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    <ChevronRight size={20} className="rotate-180 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center px-2 gap-1">
                    {[...Array(3)].map((_, i) => {
                      // Bu sadəcə vizual nümayiş üçündür, real loqika ilə dinamikləşdirilə bilər
                      const pageNum = page <= 2 ? i + 1 : page + i - 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 ${page === pageNum
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110"
                              : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <span className="text-slate-300 px-1 font-black">...</span>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={allInterviews.length <= pageSize} 
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    <ChevronRight size={20} className="text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Info Text */}
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Page <span className="text-indigo-600">{page}</span> of Insight
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;