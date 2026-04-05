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
  MessageSquare,
  Loader2,
  Reply,
  ShieldCheck,
  Zap,
  Filter,
  Inbox
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
      toast.error("System synchronization error");
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
      toast.success("Response published successfully");
      setSelectedId(null);
      setResponseText("");
      fetchReviews();
    } catch (error) {
      toast.error("Technical error during transmission");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 bg-blue-500/10 rounded-full animate-ping" />
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative z-10" />
        </div>
        <div className="text-center">
          <p className="text-slate-900 font-bold text-xl tracking-tight">Loading Data</p>
          <p className="text-slate-400 text-sm">Preparing feedback panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-10 space-y-8 bg-[#F8FAFC] min-h-screen">
      
      {/* --- DASHBOARD HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-[0.2em]">
            <ShieldCheck size={16} />
            Management Console
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            User <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Feedback</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-md">Monitor user experiences and respond in real-time.</p>
        </div>

        {/* --- STATS MINI GRID --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Pending", value: reviews.filter(r => !r.adminResponse).length, icon: <Zap size={14}/>, color: "bg-amber-500" },
            { label: "Current Page", value: page, icon: <Filter size={14}/>, color: "bg-blue-600" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-lg text-white`}>{stat.icon}</div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-lg font-black text-slate-900 leading-none">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- REVIEWS FEED --- */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {reviews.length > 0 ? (
            reviews.map((review, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                key={review.id}
                className={`group relative bg-white border rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 ${
                  review.adminResponse ? "border-slate-100" : "border-blue-200 ring-4 ring-blue-500/5 shadow-xl shadow-blue-500/5"
                }`}
              >
                <div className="p-6 md:p-10">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    {/* User Info */}
                    <div className="flex gap-5">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-400 border border-white shadow-inner group-hover:rotate-3 transition-transform duration-500">
                          <User size={32} strokeWidth={1.5} />
                        </div>
                        {!review.adminResponse && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 border-2 border-white rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 text-xl tracking-tight flex items-center gap-2">
                          {review.username || "Anonymous Guest"}
                          {review.adminResponse && <CheckCircle2 size={16} className="text-emerald-500" />}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <div className="flex items-center gap-2 py-1 px-3 bg-slate-50 rounded-full border border-slate-100">
                            <Mail size={12} className="text-blue-500" />
                            <span className="text-xs font-bold text-slate-600">{review.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar size={12} />
                            <span className="text-xs font-semibold">{review.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-sm border ${
                      review.adminResponse 
                      ? "bg-white text-emerald-600 border-emerald-100" 
                      : "bg-blue-600 text-white border-blue-700"
                    }`}>
                      {review.adminResponse ? "Resolved" : "Pending"}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="mt-8 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-transparent rounded-full opacity-30" />
                    <blockquote className="pl-8 text-slate-700 text-lg md:text-xl font-medium leading-relaxed italic">
                      "{review.message}"
                    </blockquote>
                  </div>

                  {/* Interaction Area */}
                  <div className="mt-10 pt-8 border-t border-slate-50">
                    {review.adminResponse ? (
                      <div className="bg-slate-50/50 rounded-[24px] p-6 md:p-8 border border-slate-100/50 flex flex-col sm:flex-row gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                          <MessageSquare size={80} />
                        </div>
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                          <ShieldCheck className="text-blue-600" size={24} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Official Response</p>
                          <p className="text-slate-600 font-semibold leading-relaxed text-[15px]">{review.adminResponse}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        {selectedId !== review.id ? (
                          <button
                            onClick={() => setSelectedId(review.id)}
                            className="group relative flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black tracking-widest overflow-hidden transition-all hover:bg-blue-600 active:scale-95 shadow-xl shadow-slate-200"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <Reply size={16} /> REPLY NOW
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-4"
                          >
                            <div className="relative group">
                              <textarea
                                autoFocus
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-3xl text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none min-h-[160px] shadow-inner"
                                placeholder="Write a professional response..."
                              />
                            </div>
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => setSelectedId(null)}
                                className="px-6 py-3 text-slate-400 text-[11px] font-black tracking-widest hover:text-slate-900 transition-all uppercase"
                              >
                                Cancel
                              </button>
                              <button
                                disabled={isSubmitting}
                                onClick={handleRespond}
                                className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50"
                              >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                PUBLISH
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-[40px] text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Inbox size={40} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No data found</h3>
              <p className="text-slate-400 max-w-xs mt-2">There are currently no user reviews or none matching your filter.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* --- PAGINATION --- */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-6 py-10 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
            Total results
          </div>
          <p className="text-sm font-black text-slate-900">
            Showing {reviews.length} reviews
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-20"
          >
            <ChevronLeft size={20} strokeWidth={3}/>
          </button>

          <div className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-sm shadow-lg shadow-slate-200 flex items-center gap-2">
            <span className="opacity-50 font-medium">Page</span> {page}
          </div>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={reviews.length < pageSize}
            className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-20"
          >
            <ChevronRight size={20} strokeWidth={3}/>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AdminReviews;