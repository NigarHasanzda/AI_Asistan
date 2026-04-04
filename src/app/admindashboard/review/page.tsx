"use client";

import { getAdminReviews, respondToReview } from "@/services/Admin/AdminReview";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Calendar, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock,
  Loader2,
  ArrowRight
} from "lucide-react";

const AdminReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAdminReviews(page, pageSize);
      setReviews(data);
    } catch (error) {
      toast.error("Failed to sync reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleRespond = async () => {
    if (!responseText.trim() || selectedId === null) {
      return toast.error("Response content is required");
    }

    try {
      setIsSubmitting(true);
      await respondToReview(selectedId, responseText);
      toast.success("Response published");
      setSelectedId(null);
      setResponseText("");
      fetchReviews();
    } catch (error) {
      toast.error("Transmission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <div className="absolute inset-0 blur-2xl bg-blue-400/20" />
        </div>
        <p className="text-slate-400 font-medium tracking-tight">Syncing feedback data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-12 bg-[#FDFDFD] min-h-screen">
      
      {/* Sleek Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Reviews <span className="text-blue-600">&</span> Feedback
          </h1>
          <p className="text-slate-500 font-medium">Monitor and engage with user experiences in real-time.</p>
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">System Active</span>
        </div>
      </header>

      {/* Review Feed */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {reviews.map((review) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              key={review.id}
              className={`group relative overflow-hidden bg-white border rounded-3xl p-8 transition-all duration-300 ${
                review.adminResponse 
                ? "border-slate-100 opacity-90 hover:opacity-100" 
                : "border-blue-100 shadow-xl shadow-blue-500/5 ring-1 ring-blue-50"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                    <User size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg tracking-tight">
                      {review.username || "Anonymous Guest"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs font-semibold mt-1">
                      <span className="flex items-center gap-1.5 hover:text-slate-600 transition-colors">
                        <Mail size={14} className="text-blue-500" /> {review.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-blue-500" /> {review.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${
                  review.adminResponse 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-blue-50 text-blue-600 border-blue-100 animate-pulse"
                }`}>
                  {review.adminResponse ? "Addressed" : "Action Required"}
                </div>
              </div>

              {/* User Message */}
              <div className="relative mb-8 pl-6 border-l-2 border-slate-100">
                <p className="text-slate-600 text-[16px] leading-relaxed font-medium">
                  "{review.message}"
                </p>
              </div>

              {/* Interaction Logic */}
              <div className="space-y-4">
                {review.adminResponse ? (
                  /* Display Response (No buttons here) */
                  <div className="flex gap-4 p-6 bg-slate-50/80 rounded-2xl border border-slate-100/50">
                    <div className="mt-1">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator Reply</p>
                      <p className="text-slate-700 font-semibold text-sm leading-relaxed">{review.adminResponse}</p>
                    </div>
                  </div>
                ) : (
                  /* Reply Interface */
                  <div className="flex flex-col items-end">
                    {selectedId !== review.id ? (
                      <button
                        onClick={() => setSelectedId(review.id)}
                        className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                      >
                        REPLY NOW
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full space-y-4"
                      >
                        <textarea
                          autoFocus
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-transparent p-5 rounded-2xl text-sm font-medium focus:bg-white focus:border-blue-500 transition-all outline-none min-h-[120px]"
                          placeholder="Draft your professional response..."
                        />
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setSelectedId(null)}
                            className="px-6 py-3 text-slate-400 text-[11px] font-black tracking-widest hover:text-slate-600 transition-all"
                          >
                            DISCARD
                          </button>
                          <button
                            disabled={isSubmitting}
                            onClick={handleRespond}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50"
                          >
                            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            PUBLISH REPLY
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Container */}
      <footer className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Displaying <span className="text-slate-900">{reviews.length}</span> Records
        </p>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-3 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-200">
            {page}
          </div>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={reviews.length < pageSize}
            className="p-3 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AdminReviews;