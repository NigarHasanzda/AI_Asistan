"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, Building2, Share2, Bookmark, 
  ArrowLeft, Calendar, ShieldAlert, Terminal, Users, AlertCircle, Info, Clock 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getInternshipById } from "@/services/InternshipServices";
import { addBookmark, applyToInternship, removeBookmark } from "@/services/Apply";

export default function InternshipDetail() {
  const params = useParams();
  const router = useRouter();
  const internshipId = Number(params.id);

  // States
  const [data, setData] = useState<any>(null);
  console.log(data)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Fetch Internship Details
  useEffect(() => {
    if (!internshipId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const result = await getInternshipById(internshipId);
        setData(result);
        setIsBookmarked(result.isSaved || false);
      } catch (err: any) {
        setError("Məlumat yüklenərkən xəta baş verdi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [internshipId]);

  // Toast auto-close
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle Bookmark
  const handleToggleBookmark = async () => {
    if (!internshipId || bookmarkLoading) return;
    try {
      setBookmarkLoading(true);
      if (isBookmarked) {
        await removeBookmark(internshipId);
        setIsBookmarked(false);
        setToast("Bookmarkdan silindi ❌");
      } else {
        await addBookmark(internshipId);
        setIsBookmarked(true);
        setToast("Yadda saxlanıldı ❤️");
      }
    } catch (err: any) {
      setToast(err.response?.data?.message || "Xəta baş verdi ⚠️");
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Handle Apply
  const handleApply = async () => {
    if (!internshipId || applying || data?.isClosed) return;
    try {
      setApplying(true);
      await applyToInternship(internshipId);
      setToast("Uğurla müraciət etdiniz! 🚀");
      // Müraciət sayını anlıq yeniləyək
      setData((prev: any) => ({ ...prev, applicationCount: (prev.applicationCount || 0) + 1 }));
    } catch (err: any) {

      setToast(err.response?.message|| "Artıq müraciət etmisiniz və ya xəta baş verdi");

     
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Qeyd edilməyib";
    return new Date(dateStr).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFF]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest animate-pulse">Yüklenir...</p>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
      <div className="max-w-md bg-red-50 p-8 rounded-[32px] border border-red-100">
        <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-bold mb-4">{error || "Vakansiya tapılmadı"}</p>
        <button onClick={() => router.back()} className="text-indigo-600 font-black uppercase text-xs tracking-widest flex items-center gap-2 mx-auto hover:underline">
          <ArrowLeft size={14} /> Geri Qayıt
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 pb-20 font-sans">
      
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-[24px] shadow-2xl text-sm font-bold z-50 flex items-center gap-3 border border-slate-700 whitespace-nowrap"
          >
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER NAV */}
      <div className="max-w-[90%] mx-auto px-6 pt-8 flex justify-between items-center">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-[10px] uppercase tracking-widest transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Archive
        </button>
        <div className="flex gap-2">
          <button className="p-3 rounded-2xl border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all"><Share2 size={18} /></button>
          <button 
            onClick={handleToggleBookmark} 
            disabled={bookmarkLoading}
            className={`p-3 rounded-2xl border transition-all ${isBookmarked ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
          >
            <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} className={bookmarkLoading ? "animate-pulse" : ""} />
          </button>
        </div>
      </div>

      <main className="max-w-[90%] mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-100 p-8 md:p-12 rounded-[40px] shadow-2xl shadow-slate-200/20">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center border border-indigo-100 shrink-0 shadow-inner">
                <ShieldAlert size={40} className="text-indigo-600" />
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">{data.departmentName}</span>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${data.isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                    {data.paymentStatus}
                  </span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">{data.title}</h1>
                <p className="text-xl font-bold text-slate-500 flex items-center gap-2 italic">
                  <Building2 size={22} className="text-indigo-400" /> {data.companyName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 pt-10 border-t border-slate-50">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Location</p>
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <MapPin size={16} className="text-indigo-500" /> {data.locationType === 2 ? "Hybrid" : data.locationType === 1 ? "Remote" : "On-site"}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Position ID</p>
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <Terminal size={16} className="text-indigo-500" /> #{data.id}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</p>
                <div className="flex items-center gap-2 font-bold text-emerald-600">
                  <Info size={16} /> {data.isClosed ? "Closed" : "Active"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* DESCRIPTION */}
          <section className="bg-white border border-slate-100 p-10 rounded-[40px] shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
              <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
              Role Description
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium text-lg whitespace-pre-line">
              {data.description}
            </p>
          </section>

          {/* SKILLS */}
          {data.skillNames && data.skillNames.length > 0 && (
            <section className="bg-slate-50 p-10 rounded-[40px] border border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                Required Competencies
              </h3>
              <div className="flex flex-wrap gap-3">
                {data.skillNames.map((skill: string) => (
                  <span key={skill} className="px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 shadow-sm uppercase italic">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* TIMELINE */}
          <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-xl shadow-slate-200/20">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-8">Timeline</h4>
            <div className="space-y-8 relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-[0.5px] bg-slate-100" />
              
              <div className="flex gap-5 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100"><AlertCircle size={20} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</p>
                  <p className="font-bold text-slate-800">{formatDate(data.deadlineDate)}</p>
                </div>
              </div>

              <div className="flex gap-5 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-100"><Calendar size={20} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Date</p>
                  <p className="font-bold text-slate-800">{formatDate(data.startDate)}</p>
                </div>
              </div>

              <div className="flex gap-5 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 border border-slate-100"><Clock size={20} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated End</p>
                  <p className="font-bold text-slate-800">{formatDate(data.endDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION CARD */}
          <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
            
            <div className="mb-10 relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Reach</p>
              <div className="flex items-center gap-3">
                <Users size={24} className="text-indigo-400" />
                <span className="text-4xl font-black italic">{data.applicationCount || 0}</span>
                <span className="text-xs text-slate-500 font-bold uppercase not-italic">Applicants</span>
              </div>
            </div>

            <button 
              disabled={data.isClosed || applying}
              onClick={handleApply}
              className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-widest transition-all relative z-10 ${
                data.isClosed 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-white hover:text-indigo-600 shadow-xl shadow-indigo-600/20 active:scale-95'
              }`}
            >
              {applying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                data.isClosed ? "Applications Closed" : "Apply to Position"
              )}
            </button>
            
            <p className="text-center mt-6 text-[9px] font-bold text-slate-600 uppercase tracking-widest relative z-10">
               Direct application to {data.companyName}
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}