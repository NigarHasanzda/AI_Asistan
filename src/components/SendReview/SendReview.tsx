"use client";

import { createReview, getMyReviews, deleteReview } from "@/services/Review";
import React, { useEffect, useState } from "react";
import { Send, Trash2, Clock, CheckCircle, MessageSquare, Sparkles, X, AlertCircle } from "lucide-react";

export default function SendReview() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(true);
  
  // ── NOTIFICATION (TOAST) STATE ──
  const [alert, setAlert] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({
    show: false,
    msg: "",
    type: 'success'
  });

  // ── DELETE MODAL STATE ──
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  // Helper function to trigger alerts
  const triggerAlert = (msg: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert({ show: false, msg: "", type: 'success' }), 3000);
  };

  const fetchReviews = async () => {
    setListLoading(true);
    try {
      const data = await getMyReviews();
      setReviews(data);
    } catch {
      triggerAlert("Failed to load reviews", "error");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await createReview(message);
      triggerAlert("Your review has been submitted! ✅");
      setMessage("");
      fetchReviews();
    } catch {
      triggerAlert("Could not send review ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (idToDelete === null) return;
    try {
      await deleteReview(idToDelete);
      setReviews(p => p.filter(r => r.id !== idToDelete));
      triggerAlert("Review deleted successfully");
    } catch {
      triggerAlert("An error occurred while deleting", "error");
    } finally {
      setDeleteModalOpen(false);
      setIdToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F5F8] font-sans text-slate-900 pb-10 relative">
      
      {/* ── CUSTOM ALERT POPUP ── */}
      {alert.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] w-full max-w-xs md:max-w-sm px-4 animate-in slide-in-from-top-5 duration-300">
          <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border ${
            alert.type === 'success' 
            ? "bg-[#0A192F] text-white border-blue-500/30" 
            : "bg-red-600 text-white border-red-400"
          }`}>
            {alert.type === 'success' ? <CheckCircle size={20} className="text-emerald-400" /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold flex-1">{alert.msg}</p>
            <button onClick={() => setAlert({ ...alert, show: false })}><X size={16} /></button>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="max-w-[90%] mx-auto pt-10 px-6 flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#0A192F]">Feedback Panel</h1>
          <p className="text-slate-500 font-medium">Your thoughts are valuable to us.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-white/60 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{reviews.length} Reviews</span>
        </div>
      </header>

      <main className="max-w-[90%] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── WRITE NEW REVIEW ── */}
        <div className="lg:col-span-4 lg:sticky lg:top-10">
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-8 shadow-xl shadow-blue-900/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0A192F] rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles size={20} className="text-white" />
              </div>
              <h2 className="font-bold text-lg">Post Feedback</h2>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm min-h-[160px] focus:ring-2 focus:ring-blue-500/20 transition-all outline-none mb-4 resize-none"
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !message.trim()}
              className="w-full py-4 bg-[#0A192F] hover:bg-[#112240] disabled:bg-slate-200 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-900/10"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Send size={18} /> Submit</>
              )}
            </button>
          </div>
        </div>

        {/* ── REVIEWS LIST ── */}
        <div className="lg:col-span-8">
          {listLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/50 rounded-[32px] animate-pulse" />)}
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white/40 border-2 border-dashed border-white rounded-[40px] p-20 text-center">
              <MessageSquare className="mx-auto text-slate-300 mb-4" size={40} />
              <p className="text-slate-400 font-medium italic">No reviews found yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="group relative bg-white border border-white/60 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                        <Clock size={14} />
                        {review.createdAt}
                      </div>
                      <button 
                        onClick={() => confirmDelete(review.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-[#1D2939] text-lg font-medium leading-relaxed mb-6 italic">
                      "{review.message}"
                    </p>
                    
                    {review.adminResponse ? (
                      <div className="mt-4 pt-6 border-t border-slate-50 flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-md">
                          <CheckCircle size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] font-bold text-[#0A192F]">Admin Response</span>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100">
                            {review.adminResponse}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-blue-500/60 bg-blue-50/50 w-fit px-4 py-1.5 rounded-full border border-blue-100/50">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-[11px] font-bold uppercase tracking-widest italic">Pending...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Review?</h3>
              <p className="text-slate-500 text-sm mb-8">This action cannot be undone.</p>
              
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}