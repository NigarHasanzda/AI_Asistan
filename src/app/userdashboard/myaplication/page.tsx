"use client";

import { getMyApplications, withdrawApplication } from '@/services/Apply';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { 
  FiBriefcase, FiCalendar, FiTrash2, 
  FiLoader, FiCheckCircle, FiAlertCircle, FiX, 
  FiChevronRight, FiInbox
} from "react-icons/fi";

type ActionType = { id: number; type: "withdrawing" };

const Page = () => {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<ActionType | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleWithdraw = async (id: number) => {
    setShowConfirm(null);
    setActionId({ id, type: "withdrawing" });
    try {
      await withdrawApplication(id);
      setApplications((prev) => prev.filter((item) => item.id !== id));
      setToast({ msg: "Application withdrawn successfully.", type: "success" });
    } catch (err: any) {
      setToast({ msg: err.message || "An error occurred", type: "error" });
    } finally {
      setActionId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F5F3FF] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F3FF] px-6 py-12 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`fixed top-6 right-6 z-[9999] flex items-center gap-4 p-4 rounded-2xl border shadow-xl backdrop-blur-md ${
              toast.type === "success" ? "bg-white/90 border-emerald-100" : "bg-rose-50/90 border-rose-100"
            }`}
          >
            {toast.type === "success" ? <FiCheckCircle className="text-emerald-500" /> : <FiAlertCircle className="text-rose-500" />}
            <span className="text-sm font-bold text-slate-800">{toast.msg}</span>
            <button onClick={() => setToast(null)}><FiX className="text-slate-400" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[90%] mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-[#1E1B4B]">My <span className="text-indigo-500">Applications</span></h1>
          <p className="text-slate-500 font-medium mt-2">Total {applications.length} active applications</p>
        </header>

        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {applications.length > 0 ? (
              applications.map((item, idx) => {
                const isWithdrawing = actionId?.id === item.id;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05 } }}
                    exit={{ opacity: 0, x: -50 }}
                    className="group bg-white p-6 rounded-[32px] border border-indigo-50 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all cursor-pointer overflow-hidden relative"
                    onClick={() => router.push(`/userdashboard/myaplication/${item.id}`)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                      
                      {/* Left Side: Info */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <FiBriefcase size={22} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{item.internshipTitle}</h3>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-indigo-400">{item.companyName}</span>
                            <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase">
                              <FiCalendar /> {new Date(item.appliedAt).toLocaleDateString("en-US")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Status and Button */}
                      <div className="flex items-center gap-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <div className="text-right hidden sm:block">
                            <span className="text-[10px] font-black uppercase text-indigo-300 tracking-widest block mb-0.5">Status</span>
                            <span className={`text-sm font-extrabold ${item.status === 'Pending' ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {item.status}
                            </span>
                        </div>

                        <button
                          onClick={() => setShowConfirm(item.id)}
                          disabled={!!actionId}
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 border border-slate-100 transition-all active:scale-90"
                          title="Withdraw application"
                        >
                          {isWithdrawing ? <FiLoader className="animate-spin" /> : <FiTrash2 size={18} />}
                        </button>
                        
                        <FiChevronRight className="text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" size={20} />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-20">
                <FiInbox className="mx-auto text-indigo-100 mb-4" size={64} />
                <p className="text-slate-400 font-medium">You don't have any applications yet.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(null)} className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white p-8 rounded-[36px] shadow-2xl max-w-sm w-full text-center">
              <h3 className="text-xl font-black mb-2">Withdraw Application?</h3>
              <p className="text-slate-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-slate-100 rounded-xl font-bold" onClick={() => setShowConfirm(null)}>No, Keep</button>
                <button className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold" onClick={() => handleWithdraw(showConfirm)}>Yes, Withdraw</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;