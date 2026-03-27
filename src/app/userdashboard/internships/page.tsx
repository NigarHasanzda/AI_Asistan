"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, Building2, Heart, Filter, 
  Sparkles, Zap, Globe, Home, Shuffle, 
  CheckCircle2, Info, X, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { getMatchedInternships, startPracticeInterview } from "@/services/InternshipServices";
import { addBookmark, applyToInternship, getBookmarks, removeBookmark } from "@/services/Apply";

// --- Types & Meta ---
interface Internship {
  id: number;
  title: string;
  companyName: string;
  locationType: number;
  overAllMatchScore: number;
  isPaid: boolean;
  paymentStatus: string;
}

const locationMeta = {
  0: { label: "Onsite", icon: Home, color: "text-blue-500" },
  1: { label: "Remote", icon: Globe, color: "text-indigo-500" },
  2: { label: "Hybrid", icon: Shuffle, color: "text-violet-500" },
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
  
  // Custom Toast State
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' | 'info' }[]>([]);

  // --- Helpers ---
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

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
      addToast("Failed to load internships", "error");
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
      } catch (err) { console.error(err); }
    };
    fetchBookmarks();
  }, []);

  const handleApply = async (id: number) => {
    try {
      await applyToInternship(id);
      addToast("Application sent successfully! 🚀", "success");
    } catch (err: any) {
      addToast(err.response?.data?.message || "Something went wrong", "error");
    }
  };

  const handlePractice = async (id: number) => {
    addToast("Preparing your AI interview...", "info");
    try {
      const result = await startPracticeInterview(id);
      router.push(`/userdashboard/interviews/${result}`);
    } catch (err: any) { 
      addToast(err.message || "Failed to start practice", "error"); 
    }
  };

  const toggleBookmark = async (id: number) => {
    try {
      if (bookmarkedIds.includes(id)) {
        await removeBookmark(id);
        setBookmarkedIds(prev => prev.filter(item => item !== id));
        addToast("Removed from bookmarks", "info");
      } else {
        await addBookmark(id);
        setBookmarkedIds(prev => [...prev, id]);
        addToast("Added to bookmarks", "success");
      }
    } catch (err) { addToast("Action failed", "error"); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 antialiased">
      
      {/* --- Floating Toasts --- */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-80">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
                toast.type === 'success' ? 'bg-white/90 border-emerald-100 text-emerald-900' :
                toast.type === 'error' ? 'bg-white/90 border-rose-100 text-rose-900' :
                'bg-white/90 border-blue-100 text-blue-900'
              }`}
            >
              {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-500" />}
              {toast.type === 'error' && <AlertCircle size={18} className="text-rose-500" />}
              {toast.type === 'info' && <Info size={18} className="text-blue-500" />}
              <p className="text-xs font-bold leading-tight flex-1">{toast.message}</p>
              <button onClick={() => setToasts(p => p.filter(t => t.id !== toast.id))}>
                <X size={14} className="opacity-40 hover:opacity-100 transition-opacity" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Soft Background Accent */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50/40 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-16">
        
        {/* Header */}
        <header className="mb-16">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">
              <div className="w-10 h-[1.5px] bg-blue-100 rounded-full" />
              Elevate Your Potential
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-4 italic">
                  Internship <span className="text-blue-600 not-italic">Hub</span>
                </h1>
                <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">
                  Discover elite internship programs optimized for your skill set. Stand out with AI-driven interview preparation.
                </p>
              </div>

              {/* Advanced Search */}
              <div className="relative group w-full md:w-[420px]">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search by company or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-16 pl-14 pr-6 bg-white border border-slate-200 rounded-[22px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all font-semibold shadow-sm"
                />
              </div>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3">
            <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.02)] sticky top-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Filter size={14} className="text-blue-500" /> Advanced Filters
                </h2>
                {(locationType !== null || isPaid !== null) && (
                  <button onClick={() => { setLocationType(null); setIsPaid(null); }} className="text-[10px] font-bold text-blue-500 hover:underline">Reset</button>
                )}
              </div>

              <div className="space-y-10">
                <section>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Work Environment</p>
                  <div className="flex flex-col gap-2">
                    {([0, 1, 2] as const).map((id) => {
                      const meta = locationMeta[id];
                      const Icon = meta.icon;
                      const active = locationType === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setLocationType(active ? null : id)}
                          className={`flex items-center justify-between p-4 rounded-xl text-sm font-bold transition-all border ${
                            active ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200" : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3"><Icon size={16} /> {meta.label}</div>
                          {active && <CheckCircle2 size={14} />}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Compensation</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[ {l: 'Paid', v: true}, {l: 'Unpaid', v: false} ].map(f => (
                      <button
                        key={String(f.v)}
                        onClick={() => setIsPaid(isPaid === f.v ? null : f.v)}
                        className={`py-4 rounded-xl text-[11px] font-black uppercase transition-all border ${
                          isPaid === f.v ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
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

          {/* Internship Feed */}
          <main className="lg:col-span-9 space-y-4">
            <div className="flex items-center justify-between px-2 mb-4">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                <span className="text-blue-600">{internships.length}</span> Opportunities Found
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-32 bg-white border border-slate-100 rounded-[32px] animate-pulse" />
                ))
              ) : internships.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-slate-200" size={24} />
                  </div>
                  <p className="text-slate-400 font-bold text-lg italic tracking-tight">No internships match your current filters.</p>
                </motion.div>
              ) : (
                internships.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => router.push(`/userdashboard/internships/${item.id}`)}
                    className="group relative bg-white border border-slate-100 hover:border-blue-400 p-6 md:p-8 rounded-[32px] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 overflow-hidden"
                  >
                    {/* Visual Flourish */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-16 h-16 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl font-black text-slate-800 transition-transform group-hover:scale-110 duration-500">
                          {item.companyName[0]}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{item.title}</h3>
                            {item.isPaid && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-emerald-100">Paid</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-5 text-sm font-bold text-slate-400">
                            <span className="flex items-center gap-1.5"><Building2 size={16} className="text-slate-300" /> {item.companyName}</span>
                            <span className="flex items-center gap-1.5">
                              <MapPin size={16} className={locationMeta[item.locationType as keyof typeof locationMeta]?.color} /> 
                              {locationMeta[item.locationType as keyof typeof locationMeta]?.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Side Meta & Actions */}
                      <div className="flex items-center gap-3 self-end md:self-center" onClick={e => e.stopPropagation()}>
                        {item.overAllMatchScore > 0 && (
                          <div className="hidden sm:flex flex-col items-end mr-4">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">AI Match</span>
                            <span className="text-xl font-black text-blue-600 leading-none">{item.overAllMatchScore}%</span>
                          </div>
                        )}

                        <button
                          onClick={() => toggleBookmark(item.id)}
                          className={`p-4 rounded-2xl transition-all border ${
                            bookmarkedIds.includes(item.id) 
                              ? "bg-rose-50 border-rose-100 text-rose-500 shadow-sm" 
                              : "bg-white border-slate-100 text-slate-300 hover:text-rose-400 hover:border-rose-100"
                          }`}
                        >
                          <Heart size={20} fill={bookmarkedIds.includes(item.id) ? "currentColor" : "none"} />
                        </button>

                        <button 
                          onClick={() => handlePractice(item.id)}
                          className="flex items-center gap-2 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
                        >
                          <Zap size={16} className="text-yellow-500" /> Practice
                        </button>

                        <button 
                          onClick={() => handleApply(item.id)}
                          className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
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