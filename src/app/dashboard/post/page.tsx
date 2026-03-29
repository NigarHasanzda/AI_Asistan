"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, Plus, X, Lock, Unlock, 
  CheckCircle2, AlertCircle, BarChart3, 
  Loader2, Pencil, Trash2, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getCompanyInternships, 
  addSkillToInternship, 
  deleteInternship,
  getInternshipById,
  updateInternship,
  closeInternship,
  reopenInternship
} from "@/services/InternshipServices";

// --- İnterfeyslər ---
interface Internship {
  id: number;
  title: string;
  skills: string[];
  applicantsCount?: number;
  status?: string;
  description?: string;
  deadlineDate?: string;
}

// --- Toast Bildiriş Komponenti ---
const Toast = ({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, x: 20 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className={`fixed top-6 right-6 z-[9999] flex items-center gap-4 p-4 rounded-2xl border shadow-2xl backdrop-blur-md min-w-[320px] ${
      type === "success" ? "bg-emerald-50/90 border-emerald-200 text-emerald-900" : "bg-rose-50/90 border-rose-200 text-rose-900"
    }`}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type === "success" ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
      {type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
    </div>
    <p className="text-xs font-bold flex-grow">{msg}</p>
    <button onClick={onClose} className="opacity-40 hover:opacity-100 transition-opacity"><X size={16} /></button>
  </motion.div>
);

// --- Əsas Səhifə Komponenti ---
export default function ManagePostingsPage() {
  const [postings, setPostings] = useState<Internship[]>([]);
  console.log(postings);
  
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // Toast-u avtomatik bağlamaq
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getCompanyInternships();
      // Statusa görə sıralama (Aktivlər yuxarıda)
      const sortedData = data.sort((a: any, b: any) => (a.status === "Closed" ? 1 : -1));
      setPostings(sortedData);
    } catch (err) {
      showToast("Məlumatları yükləmək mümkün olmadı", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type: "success" | "error") => setToast({ msg, type });

  // --- Funksiyalar ---
  const handleAddSkill = async (id: number, skill: string) => {
    if (!skill.trim()) return;
    try {
      await addSkillToInternship(id, skill.trim());
      setPostings(prev => prev.map(p => 
        p.id === id ? { ...p, skills: [...(p.skills || []), skill.trim()] } : p
      ));
      showToast("Skill uğurla əlavə edildi", "success");
    } catch {
      showToast("Skill əlavə edilərkən xəta baş verdi", "error");
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: string | undefined) => {
    const isClosed = currentStatus === "Closed" || currentStatus === "Inactive";
    try {
      isClosed ? await reopenInternship(id) : await closeInternship(id);
      showToast(`Elan ${isClosed ? 'aktiv edildi' : 'bağlandı'}`, "success");
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Status dəyişdirilə bilmədi", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu elanı silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteInternship(id);
      setPostings(prev => prev.filter(p => p.id !== id));
      showToast("Elan silindi", "success");
    } catch {
      showToast("Silinmə zamanı xəta baş verdi", "error");
    }
  };

  // Filterlənmiş postings
  const filteredPostings = postings.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans">
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Postings <span className="text-indigo-600">Management</span></h1>
            <p className="text-slate-500 font-medium mt-1">İş elanlarını idarə edin və müraciətləri izləyin.</p>
          </div>
          <Link href="/dashboard/post" className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95">
            <Plus size={20} /> Yeni Elan Yarat
          </Link>
        </header>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Elanlarda axtar..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
            <Loader2 className="animate-spin" size={32} />
            <p className="font-bold uppercase tracking-widest text-[10px]">Məlumatlar Yüklənir...</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPostings.map((post) => (
                <InternshipCard 
                  key={post.id} 
                  post={post} 
                  onAddSkill={handleAddSkill} 
                  onStatusToggle={handleStatusToggle}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- Kart Komponenti ---
function InternshipCard({ post, onAddSkill, onStatusToggle, onDelete }: any) {
  const [skillInput, setSkillInput] = useState("");
  const isClosed = post.status === "Closed" || post.status === "Inactive";

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative border rounded-[32px] p-6 transition-all duration-300 ${
        isClosed ? "bg-slate-50 border-slate-200 grayscale-[0.3]" : "bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100"
      }`}
    >
      {/* Top Badges & Actions */}
      <div className="flex justify-between items-start mb-6">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 ${
          isClosed ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-600"
        }`}>
          {isClosed ? <Lock size={12} /> : <CheckCircle2 size={12} />} {isClosed ? "Closed" : "Active"}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onDelete(post.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <h3 className={`text-lg font-black leading-tight mb-2 ${isClosed ? "text-slate-500" : "text-slate-900"}`}>{post.title}</h3>
      
      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.skills?.length > 0 ? (
          post.skills.map((s: string, i: number) => (
            <span key={i} className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-md">{s}</span>
          ))
        ) : (
          <span className="text-xs text-slate-400 italic">No skills added</span>
        )}
      </div>

      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-6 bg-slate-50 w-fit px-3 py-1.5 rounded-xl">
        <Users size={14} /> {post.applicantsCount || 0} Müraciət
      </div>

      {/* Quick Skill Add */}
      {!isClosed && (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Skill əlavə et..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (onAddSkill(post.id, skillInput), setSkillInput(""))}
            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button 
            onClick={() => { onAddSkill(post.id, skillInput); setSkillInput(""); }}
            className="bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      )}

      {/* Bottom Buttons */}
      <div className="flex gap-3 mt-auto">
        <Link 
          href={`/dashboard/listings/${post.id}`} 
          className="flex-1 py-3 border-2 border-indigo-600 text-indigo-600 rounded-2xl text-xs font-black text-center hover:bg-indigo-50 transition-all"
        >
          Düzəliş Et
        </Link>
        <button 
          onClick={() => onStatusToggle(post.id, post.status)}
          className={`px-4 rounded-2xl border-2 transition-all ${
            isClosed ? "border-emerald-100 text-emerald-600 bg-emerald-50" : "border-amber-100 text-amber-600 bg-amber-50"
          }`}
          title={isClosed ? "Yenidən aç" : "Bağla"}
        >
          {isClosed ? <Unlock size={18} /> : <Lock size={18} />}
        </button>
      </div>
    </motion.div>
  );
}