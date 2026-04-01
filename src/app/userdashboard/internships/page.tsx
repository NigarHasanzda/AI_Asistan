"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, Building2, Heart, Filter, 
  Zap, Globe, Home, Shuffle, 
  CheckCircle2, Info, X, AlertCircle, Lock,
  ChevronRight, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { getMatchedInternships, startPracticeInterview } from "@/services/InternshipServices";
import { addBookmark, applyToInternship, getBookmarks, removeBookmark } from "@/services/Apply";

// --- Types ---
interface Internship {
  id: number;
  title: string;
  companyName: string;
  companyPhotoUrl?: string;
  locationType: number;
  overAllMatchScore: number;
  isPaid: boolean;
  paymentStatus: string;
  isClosed: boolean;
}

const locationMeta = {
  0: { label: "Onsite", icon: Home, color: "text-blue-500", bg: "bg-blue-50" },
  1: { label: "Remote", icon: Globe, color: "text-indigo-500", bg: "bg-indigo-50" },
  2: { label: "Hybrid", icon: Shuffle, color: "text-violet-500", bg: "bg-violet-50" },
};

const InternshipHub = () => {
  const router = useRouter();

  // --- States ---
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [locationType, setLocationType] = useState<number | null>(null);
  const [isPaid, setIsPaid] = useState<boolean | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' | 'info' }[]>([]);

  // --- Toast System ---
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.CompanyName = searchTerm;
      if (locationType !== null) params.LocationType = locationType;
      if (isPaid !== null) params.IsPaid = isPaid;
      
      const data = await getMatchedInternships(params);
      if (data && Array.isArray(data.internships)) {
        setInternships(data.internships);
      }
    } catch (error) {
      addToast("Failed to fetch internship listings.", "error");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, locationType, isPaid]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await getBookmarks();
        setBookmarkedIds(data.map((item: any) => item.internshipId));
      } catch (err) { console.error("Bookmark fetch error", err); }
    };
    fetchBookmarks();
  }, []);

  // --- Actions ---
  const handleApply = async (e: React.MouseEvent, id: number, isClosed: boolean) => {
    e.stopPropagation();
    if (isClosed) return addToast("This position is no longer accepting applications.", "error");
    
    try {
      await applyToInternship(id);
      addToast("Application submitted! Check your dashboard for updates. 🚀", "success");
    } catch (err: any) {
      addToast(err.response?.data?.message || "Application failed. Please try again.", "error");
    }
  };

  const handlePractice = async (e: React.MouseEvent, id: number, isClosed: boolean) => {
    e.stopPropagation();
    if (isClosed) return addToast("Practice mode is disabled for closed roles.", "info");
    
    addToast("Generating AI Simulation...", "info");
    try {
      const result = await startPracticeInterview(id);
      router.push(`/userdashboard/interviews/${result}`);
    } catch (err: any) { 
      addToast("Failed to initialize AI Interview.", "error"); 
    }
  };

  const toggleBookmark = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      if (bookmarkedIds.includes(id)) {
        await removeBookmark(id);
        setBookmarkedIds(prev => prev.filter(item => item !== id));
        addToast("Removed from saved items.", "info");
      } else {
        await addBookmark(id);
        setBookmarkedIds(prev => [...prev, id]);
        addToast("Internship saved successfully!", "success");
      }
    } catch (err) { addToast("Could not update bookmark.", "error"); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased relative">
      
      {/* Toast Container */}
      <div className="fixed top-8 right-8 z-[100] flex flex-col gap-4 w-80">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`flex items-start gap-4 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border backdrop-blur-xl ${
                toast.type === 'success' ? 'bg-white/95 border-emerald-100 text-emerald-900' :
                toast.type === 'error' ? 'bg-white/95 border-rose-100 text-rose-900' :
                'bg-white/95 border-blue-100 text-blue-900'
              }`}
            >
              <div className="mt-0.5">
                {toast.type === 'success' && <CheckCircle2 size={20} className="text-emerald-500" />}
                {toast.type === 'error' && <AlertCircle size={20} className="text-rose-500" />}
                {toast.type === 'info' && <Info size={20} className="text-blue-500" />}
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] font-black uppercase tracking-widest opacity-50 mb-1">{toast.type}</h4>
                <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
              </div>
              <button onClick={() => setToasts(p => p.filter(t => t.id !== toast.id))} className="opacity-30 hover:opacity-100">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-12 lg:py-20">
        
        {/* --- HERO SECTION --- */}
        <header className="mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Sparkles size={14} fill="currentColor" />
                AI-Powered Matching
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 italic">Internships</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Connect with global industry leaders and accelerate your career with data-driven opportunity matching.
              </p>
            </div>

            <div className="w-full lg:w-[460px] relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-[40px] blur-2xl" />
              <div className="relative bg-white border border-slate-200 rounded-[32px] p-2 shadow-xl flex items-center">
                <div className="pl-6 text-slate-400">
                  <Search size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Company or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-12 px-4 bg-transparent outline-none text-slate-900 font-bold placeholder:text-slate-300"
                />
              </div>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* --- FILTERS SIDEBAR --- */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] sticky top-12">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Filters</h3>
                {(locationType !== null || isPaid !== null) && (
                  <button onClick={() => { setLocationType(null); setIsPaid(null); }} className="text-[10px] font-bold text-blue-600">Clear All</button>
                )}
              </div>

              <div className="space-y-10">
                <section>
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-5">Location Mode</label>
                  <div className="space-y-2">
                    {([0, 1, 2] as const).map((id) => {
                      const meta = locationMeta[id];
                      const active = locationType === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setLocationType(active ? null : id)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                            active ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-slate-50 border-transparent text-slate-500 hover:border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <meta.icon size={18} className={active ? "text-white" : meta.color} />
                            <span className="text-sm font-bold">{meta.label}</span>
                          </div>
                          {active && <CheckCircle2 size={16} />}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-5">Financials</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[ {l: 'Paid', v: true}, {l: 'Unpaid', v: false} ].map(f => (
                      <button
                        key={String(f.v)}
                        onClick={() => setIsPaid(isPaid === f.v ? null : f.v)}
                        className={`py-4 rounded-2xl text-[11px] font-black uppercase transition-all border ${
                          isPaid === f.v ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-50 border-transparent text-slate-400 hover:border-slate-200"
                        }`}
                      >
                        {f.l}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </aside>

          {/* --- MAIN FEED --- */}
          <main className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between px-4 mb-2">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Displaying <span className="text-slate-900">{internships.length}</span> Curated Roles
              </h2>
            </div>

            <AnimatePresence mode="popLayout">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-40 bg-white border border-slate-100 rounded-[40px] animate-pulse" />
                ))
              ) : (
                internships.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => !item.isClosed && router.push(`/userdashboard/internships/${item.id}`)}
                    className={`group relative bg-white border p-6 lg:p-10 rounded-[40px] transition-all duration-500
                      ${item.isClosed 
                        ? "grayscale-[0.8] opacity-70 cursor-not-allowed border-slate-200" 
                        : "border-slate-100 hover:border-blue-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] cursor-pointer"}`}
                  >
                    
                    {/* Closed Status Overlay */}
                    {item.isClosed && (
                      <div className="absolute top-6 right-10 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 z-10">
                        <Lock size={12} /> Closed
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                      
                      {/* Left: Info */}
                      <div className="flex items-center gap-8">
                        <div className="relative w-20 h-20 shrink-0 group-hover:scale-110 transition-transform duration-500">
                          <div className="absolute inset-0 bg-blue-600/5 rounded-[28px] blur-lg group-hover:blur-xl transition-all" />
                          <div className="relative w-full h-full bg-white border border-slate-100 rounded-[28px] flex items-center justify-center overflow-hidden">
                            {item.companyPhotoUrl ? (
                              <img src={item.companyPhotoUrl} alt={item.companyName} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-3xl font-black text-slate-800">{item.companyName[0]}</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className={`text-xl font-black tracking-tight ${item.isClosed ? "text-slate-400" : "text-slate-900"}`}>
                              {item.title}
                            </h3>
                            {item.isPaid && (
                              <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-emerald-100/50">
                                Paid Position
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
                            <span className="flex items-center gap-2 font-black text-slate-300 uppercase text-[10px] tracking-widest">
                              <Building2 size={16} /> {item.companyName}
                            </span>
                            <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${locationMeta[item.locationType as keyof typeof locationMeta]?.bg} ${locationMeta[item.locationType as keyof typeof locationMeta]?.color}`}>
                              <MapPin size={14} /> {locationMeta[item.locationType as keyof typeof locationMeta]?.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-4 self-end lg:self-center" onClick={e => e.stopPropagation()}>
                        {!item.isClosed && item.overAllMatchScore > 0 && (
                          <div className="hidden xl:flex flex-col items-end mr-6">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Compatibility</span>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.overAllMatchScore}%` }}
                                  className="h-full bg-blue-600"
                                />
                              </div>
                              <span className="text-lg font-black text-blue-600 leading-none">{item.overAllMatchScore}%</span>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={(e) => toggleBookmark(e, item.id)}
                          className={`p-4 rounded-[24px] transition-all border ${
                            bookmarkedIds.includes(item.id) 
                              ? "bg-rose-50 border-rose-100 text-rose-500" 
                              : "bg-slate-50 border-transparent text-slate-300 hover:text-rose-400 hover:bg-rose-50"
                          }`}
                        >
                          <Heart size={22} fill={bookmarkedIds.includes(item.id) ? "currentColor" : "none"} />
                        </button>

                        <button 
                          disabled={item.isClosed}
                          onClick={(e) => handlePractice(e, item.id, item.isClosed)}
                          className={`flex items-center gap-3 px-6 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all border
                            ${item.isClosed 
                              ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" 
                              : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200"}`}
                        >
                          <Zap size={18} className={item.isClosed ? "text-slate-300" : "text-yellow-400"} fill={item.isClosed ? "none" : "currentColor"} /> 
                          Practice
                        </button>

                        <button 
                          disabled={item.isClosed}
                          onClick={(e) => handleApply(e, item.id, item.isClosed)}
                          className={`px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95
                            ${item.isClosed 
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                              : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 hover:-translate-y-1"}`}
                        >
                          {item.isClosed ? "Closed" : "Apply Now"}
                        </button>
                      </div>
                    </div>

                    {/* Hover Decoration */}
                    {!item.isClosed && (
                      <div className="absolute bottom-0 left-10 right-10 h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default InternshipHub;