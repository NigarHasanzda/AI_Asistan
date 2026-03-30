"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Yönləndirmə üçün bunu əlavə etdik
import { getAdminStudents } from "@/services/Admin/Students";
import { GetTargetJobs } from "@/services/TargetJob";
import { TargetJob } from "@/types/targetjob";
import { Search, ChevronLeft, ChevronRight, Mail, Briefcase, X, Eye } from "lucide-react";

const Page = () => {
  const router = useRouter(); // Router-i başladırıq
  const [students, setStudents] = useState<any[]>([]);
  const [targetJobs, setTargetJobs] = useState<TargetJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Pagination States
  const [keyword, setKeyword] = useState("");
  const [targetJobId, setTargetJobId] = useState<number | "">("");
  const [isPremium, setIsPremium] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // --- Fetch Target Jobs ---
  useEffect(() => {
    const fetchJobs = async () => {
      const jobs = await GetTargetJobs();
      setTargetJobs(jobs);
    };
    fetchJobs();
  }, []);

  // --- Fetch Students ---
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await getAdminStudents({
          Keyword: keyword || undefined,
          page,
          pageSize,
        });
        setStudents(res || []);
      } catch (err) {
        console.error("Fetch Students Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchStudents, 400);
    return () => clearTimeout(debounce);
  }, [keyword, page]);

  // --- Frontend Filters ---
  const filteredStudents = students.filter((s) => {
    const jobMatch =
      !targetJobId ||
      s.targetJobName === targetJobs.find((j) => j.id === targetJobId)?.name;

    const premiumMatch =
      isPremium === "all" ||
      (isPremium === "true" && s.isPremium) ||
      (isPremium === "false" && !s.isPremium);

    return jobMatch && premiumMatch;
  });

  const resetFilters = () => {
    setKeyword("");
    setTargetJobId("");
    setIsPremium("all");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-4 md:p-10 text-[#2B3674]">
      
      {/* --- HEADER --- */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tələbə Directory</h1>
          <p className="text-slate-500 font-medium">Real vaxt rejimində tələbə idarəetməsi</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 font-bold text-blue-600">
          Nəticə: {filteredStudents.length}
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white mb-8 flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Ada görə axtarış..."
            className="w-full pl-12 pr-12 py-3 bg-[#F4F7FE] border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
            value={keyword}
          />
          {keyword && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
              onClick={() => setKeyword("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            className="flex-1 md:flex-none bg-[#F4F7FE] border-none p-3 px-5 rounded-2xl font-semibold text-sm cursor-pointer hover:bg-slate-100 transition-all focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => { 
              setTargetJobId(e.target.value ? Number(e.target.value) : ""); 
              setPage(1); 
            }}
            value={targetJobId}
          >
            <option value="">Bütün Vakansiyalar</option>
            {targetJobs.map((job) => (
              <option key={job.id} value={job.id}>{job.name}</option>
            ))}
          </select>

          <select
            className="flex-1 md:flex-none bg-[#F4F7FE] border-none p-3 px-5 rounded-2xl font-semibold text-sm cursor-pointer hover:bg-slate-100 transition-all focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => { setIsPremium(e.target.value); setPage(1); }}
            value={isPremium}
          >
            <option value="all">Bütün Statuslar</option>
            <option value="true">Yalnız Premium</option>
            <option value="false">Yalnız Standart</option>
          </select>

          <button
            onClick={resetFilters}
            className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* --- STUDENT LIST --- */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-white rounded-[30px]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((s) => (
            <div key={s.id} className="bg-white p-6 rounded-[30px] shadow-sm border border-transparent hover:border-indigo-100 transition-all duration-300 group relative overflow-hidden">
              
              {/* Premium Badge */}
              <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${s.isPremium ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {s.isPremium ? 'Premium ✨' : 'Standard'}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm">
                  {s.fullname?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{s.fullname}</h3>
                  <p className="text-indigo-500 text-sm font-semibold italic">@{s.username}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-500">
                  <Mail size={16} className="text-slate-300" />
                  <span className="text-sm truncate font-medium">{s.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Briefcase size={16} className="text-slate-300" />
                  <span className="text-sm font-semibold text-slate-600">{s.targetJobName || "Qeyd yoxdur"}</span>
                </div>
              </div>

              {/* Yönləndirmə Düyməsi */}
              <button 
                onClick={() => router.push(`/admindashboard/students/${s.id}`)}
                className="w-full py-3 bg-[#F4F7FE] hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                Profilə Bax
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- PAGINATION --- */}
      <div className="mt-12 flex items-center justify-center gap-2">
        <button 
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 hover:bg-indigo-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="bg-white px-5 py-2 rounded-xl border border-slate-100 shadow-sm font-bold text-indigo-600">
          {page}
        </div>
        
        <button 
          disabled={students.length < pageSize}
          onClick={() => setPage(p => p + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 hover:bg-indigo-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Page;