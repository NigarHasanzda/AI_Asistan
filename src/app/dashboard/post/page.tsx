"use client";

import React, { useState, useEffect } from "react";
import { createInternship } from "@/services/InternshipServices";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, Calendar, MapPin, Briefcase, 
  FileText, CheckCircle2, Loader2, DollarSign, 
  X, AlertCircle, Globe, Building2, Home,
  ArrowRight, Sparkles
} from "lucide-react";

export default function CreateInternshipPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(true);
  const [locationType, setLocationType] = useState(0); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");

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

  const inputStyles = "w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400";
  const labelStyles = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white py-16 px-4">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-8 right-8 z-[100] flex items-center gap-4 p-5 rounded-2xl shadow-2xl border backdrop-blur-xl ${
              toast.type === "success" ? "bg-white/90 border-emerald-100" : "bg-white/90 border-rose-100"
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              toast.type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}>
              {toast.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{toast.type === "success" ? "Excellent!" : "System Error"}</p>
              <p className="text-xs text-slate-500 font-medium">{toast.msg}</p>
            </div>
            <button onClick={() => setToast(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={18} className="text-slate-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/70 backdrop-blur-md rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-white p-8 md:p-14 relative overflow-hidden"
        >
          {/* Decorative blur background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

          <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
            
            {/* Section 1: Content */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-200">1</span>
                <h3 className="text-xl font-bold text-slate-800">Basic Information</h3>
              </div>

              <div className="grid gap-6">
                <div>
                  <label className={labelStyles}>Job Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="e.g. Frontend Developer Intern" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      required 
                      className={`${inputStyles} pl-12 h-14 text-lg`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyles}>Detailed Description</label>
                  <textarea 
                    placeholder="What will the intern do? Mention tech stack and expectations..." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                    rows={6}
                    className={`${inputStyles} resize-none py-4`}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Logistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-200">2</span>
                    <h3 className="text-xl font-bold text-slate-800">Environment</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 0, icon: Globe, label: "Remote" },
                        { id: 1, icon: Building2, label: "Onsite" },
                        { id: 2, icon: Home, label: "Hybrid" }
                    ].map((type) => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => setLocationType(type.id)}
                            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                locationType === type.id 
                                ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm" 
                                : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                            }`}
                        >
                            <type.icon size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-indigo-600">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Paid Internship</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} className="sr-only peer"/>
                        <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-6 peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-200">3</span>
                    <h3 className="text-xl font-bold text-slate-800">Timeline</h3>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyles}>Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className={inputStyles} />
                        </div>
                        <div>
                            <label className={labelStyles}>End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className={inputStyles} />
                        </div>
                    </div>
                    <div>
                        <label className={labelStyles}>Application Deadline</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" size={16} />
                            <input type="date" value={deadlineDate} onChange={(e) => setDeadlineDate(e.target.value)} required className={`${inputStyles} pl-11 border-rose-100 text-rose-600 focus:border-rose-400 focus:ring-rose-500/10`} />
                        </div>
                    </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="submit" 
                disabled={loading}
                className="group relative w-full h-16 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Loader2 className="animate-spin" size={24} />
                    </motion.div>
                  ) : (
                    <motion.div key="text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
                        Publish Placement 
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
              <p className="text-center mt-6 text-xs text-slate-400 font-medium">By publishing, you agree to our Terms of Talent Acquisition.</p>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}