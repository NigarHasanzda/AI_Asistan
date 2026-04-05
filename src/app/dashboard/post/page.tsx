"use client";

import React, { useState, useEffect } from "react";
import { createInternship } from "@/services/InternshipServices";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Briefcase, CheckCircle2, Loader2, DollarSign, 
  X, AlertCircle, Globe, Building2, Home,
  ArrowRight, Hash, Plus, Sparkles, FileText
} from "lucide-react";

interface TemporarySkill {
  tempId: number;
  name: string;
}

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
  
  const [skills, setSkills] = useState<TemporarySkill[]>([]);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.find(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, { tempId: Date.now(), name: trimmed }]);
      setSkillInput("");
    }
  };

  const removeSkill = (tempId: number) => {
    setSkills(skills.filter(s => s.tempId !== tempId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (skills.length === 0) {
      setToast({ msg: "Please add at least one required skill.", type: "error" });
      return;
    }
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
        skills: skills.map(s => s.name) 
      };

      await createInternship(payload);
      setToast({ msg: "Internship posted successfully! 🎉", type: "success" });
      
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setDeadlineDate("");
      setSkills([]);
      
    } catch (error: any) {
      setToast({ msg: error.response?.data?.message || "Something went wrong.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full bg-slate-50/80 border border-slate-200 rounded-2xl py-3.5 px-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 shadow-sm";
  const labelStyles = "block text-[12px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1";

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-4">
      
      {/* Dynamic Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-10 right-1/2 translate-x-1/2 md:right-10 md:translate-x-0 z-[100] flex items-center gap-4 p-5 rounded-[2rem] shadow-2xl border backdrop-blur-xl ${
              toast.type === "success" ? "bg-white/90 border-emerald-100" : "bg-white/90 border-rose-100"
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              toast.type === "success" ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-rose-500 text-white shadow-rose-200"
            }`}>
              {toast.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>
            <div className="pr-4">
              <p className="text-sm font-black text-slate-900">{toast.type === "success" ? "Success" : "Error"}</p>
              <p className="text-xs text-slate-500 font-bold">{toast.msg}</p>
            </div>
            <button onClick={() => setToast(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X size={18} className="text-slate-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 -mt-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Post an <span className="text-indigo-600">Internship</span></h1>
          <p className="text-slate-500 font-bold">Find the brightest talents for your upcoming projects.</p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-16"
        >
          <form onSubmit={handleSubmit} className="space-y-16">
            
            {/* Step 1: General Details */}
            <section className="space-y-10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-xl shadow-indigo-100">1</div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Core Information</h3>
                  <p className="text-sm font-bold text-slate-400 italic">Describe the role and requirements</p>
                </div>
              </div>

              <div className="grid gap-8">
                <div className="space-y-1">
                  <label className={labelStyles}>Position Title</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="e.g. Software Engineer Intern" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      required 
                      className={`${inputStyles} pl-14 h-16 text-lg`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={labelStyles}>Job Description</label>
                  <div className="relative group">
                    <FileText className="absolute left-5 top-6 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <textarea 
                      placeholder="Outline roles, responsibilities, and specific requirements..." 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      required 
                      rows={5}
                      className={`${inputStyles} pl-14 resize-none py-5`}
                    />
                  </div>
                </div>

                {/* Skills Component */}
                <div className="space-y-4">
                  <label className={labelStyles}>Required Skill Stack</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 group">
                      <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="Add skill (e.g. React, Python)..." 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        className={`${inputStyles} pl-14`}
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={addSkill}
                      className="bg-slate-900 text-white px-8 h-[58px] rounded-2xl font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-slate-200"
                    >
                      <Plus size={20} /> Add
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <AnimatePresence>
                      {skills.map((skill) => (
                        <motion.div
                          key={skill.tempId}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 border border-indigo-100 rounded-[1rem] text-sm font-black shadow-sm group hover:border-indigo-300 transition-colors"
                        >
                          {skill.name}
                          <button 
                            type="button" 
                            onClick={() => removeSkill(skill.tempId)}
                            className="p-1 hover:bg-indigo-50 text-indigo-300 hover:text-indigo-600 rounded-lg transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2 & 3: Config & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <section className="space-y-10">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-xl shadow-indigo-100">2</div>
                    <h3 className="text-xl font-black text-slate-800">Environment</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 1, icon: Building2, label: "On-site" },
                        { id: 0, icon: Globe, label: "Remote" },
                        { id: 2, icon: Home, label: "Hybrid" }
                    ].map((type) => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => setLocationType(type.id)}
                            className={`flex flex-col items-center justify-center gap-3 p-5 rounded-[1.5rem] border-2 transition-all duration-300 ${
                                locationType === type.id 
                                ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xl shadow-indigo-100/50 scale-105" 
                                : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                            }`}
                        >
                            <type.icon size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[1.5rem] border border-dashed border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-indigo-600">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-700">Paid Internship</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Financial Compensation</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} className="sr-only peer"/>
                        <div className="w-14 h-8 bg-slate-200 rounded-full peer peer-checked:after:translate-x-6 peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md"></div>
                    </label>
                </div>
              </section>

              <section className="space-y-10">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-xl shadow-indigo-100">3</div>
                    <h3 className="text-xl font-black text-slate-800">Timeline</h3>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className={labelStyles}>Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className={inputStyles} />
                        </div>
                        <div className="space-y-1">
                            <label className={labelStyles}>End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className={inputStyles} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className={labelStyles}>Application Deadline</label>
                        <div className="relative group">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-400" size={18} />
                            <input 
                              type="date" 
                              value={deadlineDate} 
                              onChange={(e) => setDeadlineDate(e.target.value)} 
                              required 
                              className={`${inputStyles} pl-14 border-rose-100 text-rose-600 focus:border-rose-400 focus:ring-rose-400/10`} 
                            />
                        </div>
                    </div>
                </div>
              </section>
            </div>

            {/* Submission */}
            <div className="pt-10">
              <button 
                type="submit" 
                disabled={loading}
                className="group relative w-full h-20 bg-slate-900 hover:bg-indigo-600 text-white rounded-[2rem] font-black text-xl transition-all duration-500 shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={28} /> : (
                    <>
                        Post Vacancy <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </>
                )}
                {/* Glossy overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </button>
              <p className="text-center mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest">By clicking post, you agree to our recruitment guidelines.</p>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}