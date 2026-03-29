"use client";

import React, { useState, useEffect } from "react";
import { createInternship } from "@/services/InternshipServices";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, Calendar, MapPin, Briefcase, 
  FileText, CheckCircle2, Loader2, DollarSign, 
  X, AlertCircle 
} from "lucide-react";

export default function CreateInternshipPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  
  // States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(true);
  const [locationType, setLocationType] = useState(0); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");

  // Toast-u avtomatik bağlamaq üçün
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        isPaid,
        locationType,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        deadlineDate: new Date(deadlineDate).toISOString(),
        departmentId: 1,
        skillIds: [1] 
      };

      await createInternship(payload);
      
      setToast({ msg: "Opportunity published successfully! 🎉", type: "success" });
      
      // Formu təmizləmək
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setDeadlineDate("");
      
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to create internship.";
      setToast({ msg: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      
      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={`fixed top-6 right-6 z-[9999] flex items-center gap-4 p-4 pr-6 rounded-2xl border shadow-2xl backdrop-blur-md max-w-[380px] 
              ${toast.type === "success" ? "bg-emerald-50/90 border-emerald-200" : "bg-rose-50/90 border-rose-200"}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 
              ${toast.type === "success" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
              {toast.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </div>
            <div className="flex-grow">
              <h4 className={`text-sm font-bold ${toast.type === "success" ? "text-emerald-900" : "text-rose-900"}`}>
                {toast.type === "success" ? "Success" : "Error"}
              </h4>
              <p className="text-xs font-medium text-slate-600 leading-tight">{toast.msg}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        {/* <div className="mb-10 text-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-6"
          >
            <PlusCircle size={32} />
          </motion.div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create <span className="text-indigo-600">Internship</span></h1>

        </div> */}

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            
            {/* General Information Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                <FileText size={18} className="text-indigo-500" />
                <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs">General Information</h2>
              </div>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Internship Title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700 placeholder:text-slate-400" 
                />

                <textarea 
                  placeholder="Responsibilities & requirements..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  required 
                  rows={4}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-400" 
                />
              </div>
            </section>

            {/* Logistics Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <MapPin size={18} className="text-indigo-500" />
                  <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs">Location & Type</h2>
                </div>
                
                <select 
                  value={locationType} 
                  onChange={(e) => setLocationType(Number(e.target.value))} 
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
                >
                  <option value={0}>🌐 Remote</option>
                  <option value={1}>🏢 Onsite</option>
                  <option value={2}>🏠 Hybrid</option>
                </select>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <DollarSign size={18} className="text-indigo-500" />
                  <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs">Compensation</h2>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 h-[60px]">
                  <p className="text-sm font-black text-slate-800">Paid Position</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isPaid} 
                      onChange={(e) => setIsPaid(e.target.checked)} 
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Dates Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                <Calendar size={18} className="text-indigo-500" />
                <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs">Key Dates</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-tighter">Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-tighter">End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-tighter">Deadline</label>
                  <input type="date" value={deadlineDate} onChange={(e) => setDeadlineDate(e.target.value)} required className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-rose-500" />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>Publish Internship <Briefcase size={20} /></>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}