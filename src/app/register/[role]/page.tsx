"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { RegisterRequest } from "@/types/register";
import { UserRegister } from "@/services/Auth";

const Page = () => {
  const params = useParams();
  const router = useRouter();

  const urlRole = Array.isArray(params.role) ? params.role[0] : params.role;

  const [formData, setFormData] = useState<RegisterRequest>({
    userName: "",
    email: "",
    password: "",
    role: 1,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const roleValue = urlRole === "employer" ? 2 : 1;
    setFormData((prev) => ({ ...prev, role: roleValue }));
  }, [urlRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(formData.password)) {
      toast.error("Password must be at least 8 characters with upper, lower, number, and special character.");
      return;
    }

    setLoading(true);
    const t = toast.loading("Creating your account...");

    try {
      const result = await UserRegister(formData);

      localStorage.setItem("token", result.token);
      localStorage.setItem("roleId", formData.role.toString());
      localStorage.setItem("role", formData.role === 2 ? "employer" : "student");

      toast.success("Welcome aboard! Registration successful.", { id: t });

      setTimeout(() => {
        const path = formData.role === 1 
          ? "/register/student/studentprofile" 
          : "/register/employer/employerprofile";
        router.push(path);
      }, 1500);

    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Registration failed";
      const finalMsg = (message.toLowerCase().includes("exist") || message.toLowerCase().includes("already"))
        ? "This email is already registered."
        : message;
      
      toast.error(finalMsg, { id: t });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[520px] relative z-10"
      >
        <div className="bg-white rounded-[40px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-12">
          
          {/* LOGO / ICON */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200 rotate-3">
              <ShieldCheck size={32} className="text-white -rotate-3" />
            </div>
          </div>

          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Join as <span className="text-blue-600 italic">{formData.role === 2 ? "Employer" : "Student"}</span>
            </h1>
            <p className="text-slate-500 font-medium">Create your account to unlock all features.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* FULL NAME */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  name="userName"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <AlertCircle size={12} />
                <span>8+ chars, Case sensitive, Symbol & Number</span>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 font-black hover:underline underline-offset-4 ml-1">
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* TRUST BADGE */}
        <div className="mt-8 flex justify-center items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <ShieldCheck size={14} className="text-emerald-500" />
          Secure Enterprise-grade Registration
        </div>
      </motion.div>
    </div>
  );
};

export default Page;