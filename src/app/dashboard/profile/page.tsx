"use client";

import React, { useEffect, useState, useCallback } from 'react';
import {
  Globe, Mail, Camera, Save, X, Pencil, CheckCircle2,
  Info, ArrowUpRight, ShieldCheck, Building2, Trash2, AlertTriangle, Loader2
} from 'lucide-react';
import { getMyCompany, updateCompany } from '@/services/CompanyServices';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { deleteAccount } from '@/services/Auth';

interface CompanyData {
  companyName: string;
  email: string;
  photoUrl: string;
  username: string;
  website: string;
}

const CompanyProfilePage = () => {
  const router = useRouter();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [editMode, setEditMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [form, setForm] = useState({
    Username: "",
    CompanyName: "",
    Website: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const companyData = await getMyCompany(token);
      setCompany(companyData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchData();
  }, [mounted, fetchData]);

  useEffect(() => {
    if (company) {
      setForm({
        Username: company.username || "",
        CompanyName: company.companyName || "",
        Website: company.website || "",
      });
      setPreviewUrl(company.photoUrl || "");
    }
  }, [company]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await updateCompany(
        { Username: form.Username, CompanyName: form.CompanyName, Website: form.Website, Photo: photo || undefined },
        token
      );
      await fetchData();
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error: any) {
      console.error("Update error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      localStorage.removeItem("token");
      router.push("/"); 
    } catch (error: any) {
      alert(error.message || "An error occurred while deleting the account");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 pb-20 font-sans">
      
      {/* ── HEADER ── */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Building2 size={20} />
          </div>
          <span className="font-bold tracking-tight text-sm uppercase text-slate-500">Corporate Panel</span>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm ${
            editMode ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-white border border-slate-200 text-blue-600 hover:border-blue-200 hover:bg-blue-50/30"
          }`}
        >
          {editMode ? <><X size={14}/> Cancel</> : <><Pencil size={14}/> Update Profile</>}
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-700" />
            <div className="relative pt-12 text-center">
              <div className="relative inline-block group">
                <motion.div className="w-36 h-36 rounded-3xl border-8 border-white shadow-2xl overflow-hidden bg-slate-50 mx-auto">
                  <img src={previewUrl || "/default-company.png"} alt="Logo" className="w-full h-full object-cover" />
                </motion.div>
                <AnimatePresence>
                  {editMode && (
                    <motion.label initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-blue-900/40 rounded-3xl cursor-pointer backdrop-blur-[2px]">
                      <Camera className="text-white w-7 h-7" />
                      <input type="file" className="hidden" onChange={handlePhotoChange} />
                    </motion.label>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-6 space-y-1">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">{company?.companyName}</h2>
                <div className="flex items-center justify-center gap-1.5 text-blue-600 font-semibold text-sm">
                  <ShieldCheck size={14} />
                  <span>@{company?.username}</span>
                </div>
              </div>
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-rose-50/50 rounded-[2rem] p-6 border border-rose-100">
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="w-full py-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition-all shadow-sm"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {editMode ? (
              <motion.div key="edit" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Company Name</label>
                    <input value={form.CompanyName} onChange={(e) => setForm({ ...form, CompanyName: e.target.value })} className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Username</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500 font-bold">@</span>
                      <input value={form.Username} onChange={(e) => setForm({ ...form, Username: e.target.value })} className="w-full pl-10 pr-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Website</label>
                    <input value={form.Website} onChange={(e) => setForm({ ...form, Website: e.target.value })} placeholder="https://example.com" className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium" />
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleUpdate} className="w-full mt-10 bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center justify-center gap-3">
                  <Save size={20} /> Save Changes
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <div className="bg-gradient-to-br from-slate-900 to-blue-900 flex flex-col rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300 mb-8">Official Contact Details</h3>
                  <div className="flex flex-col gap-8 relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner">
                        <Mail size={20} className="text-blue-300"/>
                      </div>
                      <div>
                        <p className="text-[10px] text-blue-400 uppercase font-bold tracking-tighter">Email Address</p>
                        <p className="text-base font-semibold">{company?.email}</p>
                      </div>
                    </div>
                    {company?.website && (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 group transition-transform hover:translate-x-1">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner group-hover:bg-blue-500/40 transition-colors">
                          <Globe size={20} className="text-blue-300"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-blue-400 uppercase font-bold tracking-tighter">Web Resource</p>
                          <p className="text-base font-semibold flex items-center gap-2">
                            {company.website.replace(/^https?:\/\//, '')} <ArrowUpRight size={14} className="opacity-50"/>
                          </p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/60"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Delete Account?</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                This action is irreversible. All your listings and data will be permanently removed. Are you sure you want to proceed?
              </p>
              <div className="flex gap-4">
                <button 
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
                >
                  Go Back
                </button>
                <button 
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                  className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-blue-300 flex items-center gap-3 z-50 border border-blue-400">
            <CheckCircle2 size={20} />
            <span className="text-sm font-bold tracking-tight">Profile updated successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanyProfilePage;