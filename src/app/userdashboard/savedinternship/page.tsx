"use client";

import { getBookmarks, removeBookmark, applyToInternship } from "@/services/Apply";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // Yönləndirmə üçün əlavə edildi
import { 
  FiBookmark, FiCalendar, 
  FiArrowRight, FiBriefcase, FiTrash2, FiLoader, 
  FiCheckCircle, FiAlertCircle, FiX, FiEye 
} from "react-icons/fi";

type ActionType = { id: number; type: "deleting" | "applying" };

const Page = () => {
  const router = useRouter(); // Router hook-u
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<ActionType | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);

  const fetchBookmarks = async () => {
    try {
      const data = await getBookmarks();
      setBookmarks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookmarks(); }, []);

  const handleError = (err: any) => {
    const errorMsg = err.response?.data?.message || err.message || "An unexpected error occurred.";
    setToast({ msg: errorMsg, type: "error" });
  };

  const handleDelete = async (internshipId: number) => {
    setShowConfirm(null);
    setActionId({ id: internshipId, type: "deleting" });
    try {
      await removeBookmark(internshipId);
      setBookmarks((prev) => prev.filter((item) => item.internshipId !== internshipId));
      setToast({ msg: "Vacancy removed from bookmarks.", type: "success" });
    } catch (err) {
      handleError(err);
    } finally {
      setActionId(null);
    }
  };

  const handleApply = async (internshipId: number) => {
    setActionId({ id: internshipId, type: "applying" });
    try {
      await applyToInternship(internshipId);
      setToast({ msg: "Application sent successfully! 🎉", type: "success" });
      setTimeout(() => {
        setBookmarks((prev) => prev.filter((item) => item.internshipId !== internshipId));
      }, 600);
    } catch (err: any) {
      handleError(err);
    } finally {
      setActionId(null);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) return (
    <div className="min-h-screen bg-[#F5F3FF] flex flex-col items-center justify-center gap-5">
      <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-indigo-300 font-medium animate-pulse">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F3FF] relative overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-600 px-6 py-12">
      {/* Background Gradients (Eyni qalır) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[80%] h-[50%] bg-[#DDD6FE]/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[0%] right-[0%] w-[60%] h-[40%] bg-[#BAE6FD]/30 blur-[120px] rounded-full" />
      </div>

      {/* Toast Notification (Eyni qalır) */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.92 }}
            className={`fixed top-6 right-6 z-[9999] flex items-center gap-4 p-4 pr-6 rounded-[20px] border shadow-2xl backdrop-blur-xl max-w-[360px] 
              ${toast.type === "success" ? "bg-emerald-50/90 border-emerald-200" : "bg-rose-50/90 border-rose-200"}`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 
              ${toast.type === "success" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
              {toast.type === "success" ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
            </div>
            <p className="text-sm font-semibold text-slate-900 flex-grow leading-tight">{toast.msg}</p>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <FiX size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal (Eyni qalır) */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1E1B4B]/25 backdrop-blur-md"
              onClick={() => setShowConfirm(null)}
            />
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="relative bg-white p-10 rounded-[40px] shadow-[0_24px_80px_0_rgba(129,140,248,0.25)] border border-indigo-50 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiTrash2 size={32} />
              </div>
              <h3 className="text-2xl font-extrabold text-[#1E1B4B] mb-2 tracking-tight">Are you sure?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">This vacancy will be permanently removed from your bookmarks.</p>
              <div className="flex gap-3">
                <button className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-colors" onClick={() => setShowConfirm(null)}>Cancel</button>
                <button className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all active:scale-95" onClick={() => handleDelete(showConfirm)}>Yes, Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-[90%] mx-auto relative z-10">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide">
              <FiBookmark size={12} /> BOOKMARKS
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1E1B4B] tracking-tight leading-[1.1] mb-2">
            Saved<br />
            <span className="text-indigo-500">Vacancies</span>
          </h1>
          <p className="text-slate-500 font-medium">{bookmarks.length} vacancies waiting in your list</p>
        </motion.header>

        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {bookmarks.length > 0 ? (
              bookmarks.map((item, idx) => {
                const isProcessing = actionId?.id === item.internshipId;
                const isDeleting = isProcessing && actionId?.type === "deleting";
                const isApplying = isProcessing && actionId?.type === "applying";

                return (
                  <motion.div
                    key={item.internshipId}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05 } }}
                    exit={{ opacity: 0, x: -60, filter: "blur(8px)" }}
                    className="group bg-white p-5 md:p-6 rounded-[32px] border border-[#E8E4FF] shadow-[0_2px_16px_0_rgba(129,140,248,0.1)] hover:shadow-[0_8px_40px_0_rgba(129,140,248,0.2)] hover:border-indigo-200 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                          <FiBriefcase size={24} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-[#1E1B4B] mb-1 group-hover:text-indigo-600 transition-colors truncate">
                            {item.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="text-sm font-bold text-indigo-400">{item.companyName}</span>
                            <span className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                              <FiCalendar className="shrink-0" />
                              {new Date(item.startDate).toLocaleDateString("en-US")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* VIEW DETAILS BUTTON - YENİ ƏLAVƏ EDİLDİ */}
                        <button
                          onClick={() => router.push(`/userdashboard/internships/${item.internshipId}`)}
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 border border-[#E8E4FF] hover:bg-indigo-100 transition-all active:scale-90 shadow-sm"
                          title="View Details"
                        >
                          <FiEye size={20} />
                        </button>

                        <button
                          onClick={() => setShowConfirm(item.internshipId)}
                          disabled={!!isProcessing}
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-[#E8E4FF] hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-90 disabled:opacity-30"
                          title="Delete Bookmark"
                        >
                          {isDeleting ? <FiLoader className="animate-spin" /> : <FiTrash2 size={18} />}
                        </button>
                        
                        <button
                          onClick={() => handleApply(item.internshipId)}
                          disabled={!!isProcessing}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2.5 bg-gradient-to-br from-indigo-500 to-violet-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:brightness-110 active:scale-95 transition-all disabled:opacity-45"
                        >
                          {isApplying ? (
                            <FiLoader className="animate-spin" />
                          ) : (
                            <>Apply Now <FiArrowRight size={16} /></>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              /* Empty State (Eyni qalır) */
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center py-20 px-6">
                <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-[35%] flex items-center justify-center mb-6 animate-pulse">
                  <FiBookmark size={40} />
                </div>
                <h2 className="text-xl font-bold text-[#1E1B4B] mb-2">The list is empty</h2>
                <p className="text-slate-400 max-w-[280px] leading-relaxed text-sm font-medium">Save vacancies you like and apply easily from here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Page;