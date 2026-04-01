"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // Yönləndirmə üçün
import { 
  Building2, 
  Globe, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { createCompany, uploadCompanyPhoto } from "@/services/CompanyServices";

const CreateCompanyStepByStep = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({ name: "", website: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  // Sessiyanı bitirib login-ə göndərən funksiya
  const logoutAndRedirect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Əgər başqa local məlumatlar varsa, onları da bura əlavə edə bilərsən
    toast.success("Profile completed! Please login again to refresh your session.");
    
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  // Step 1: Create Company
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const t = toast.loading("Creating company profile...");

    try {
      await createCompany(
        { companyName: companyInfo.name, website: companyInfo.website },
        token
      );
      toast.success("Company created! Now let's add a logo.", { id: t });
      setStep(2);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create company", { id: t });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Upload Photo
  const handleUploadPhoto = async () => {
    if (!file) return toast.error("Please select a logo first");

    setLoading(true);
    const t = toast.loading("Uploading logo...");

    try {
      await uploadCompanyPhoto(file, token);
      toast.success("Logo uploaded successfully!", { id: t });
      
      // Məlumatları sil və loginə yönləndir
      logoutAndRedirect();
      
    } catch (error: any) {
      toast.error("Photo upload failed", { id: t });
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <Toaster position="top-center" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
      >
        <div className="flex h-2 bg-slate-100">
          <motion.div 
            className="bg-indigo-600 h-full"
            animate={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        <div className="p-10 md:p-14">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                {step === 1 ? <Building2 size={24} /> : <ImageIcon size={24} />}
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
                Step {step} of 2
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {step === 1 ? "Company Details" : "Upload Brand Logo"}
            </h1>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleCreateCompany}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Company Name</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Website URL</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      type="url"
                      required
                      placeholder="https://acme.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                      value={companyInfo.website}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[22px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20} /></>}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div 
                  className={`relative border-2 border-dashed rounded-[32px] p-12 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer
                    ${preview ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-indigo-300'}`}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input id="file-upload" type="file" hidden onChange={onFileChange} accept="image/*" />
                  
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-32 h-32 rounded-3xl object-cover shadow-lg border-4 border-white" />
                  ) : (
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm text-indigo-600">
                      <UploadCloud size={32} />
                    </div>
                  )}
                  
                  <div className="text-center">
                    <p className="font-bold text-slate-800">{preview ? "Change Logo" : "Drop your logo here"}</p>
                    <p className="text-sm text-slate-400 font-medium">Click to select</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleUploadPhoto}
                    disabled={loading || !file}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[22px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <>Complete Setup <CheckCircle2 size={20} /></>}
                  </button>
                  <button 
                    onClick={logoutAndRedirect}
                    className="text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                  >
                    Skip & Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateCompanyStepByStep;