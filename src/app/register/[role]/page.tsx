"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!validatePassword(formData.password)) {
      setError("Şifrə ən azı 8 simvol, böyük/kiçik hərf, rəqəm və xüsusi simvol içerməlidir");
      setLoading(false);
      return;
    }

    try {
      const result = await UserRegister(formData);
      localStorage.setItem("token", result.token);
      localStorage.setItem("roleId", formData.role.toString());
      localStorage.setItem("role", formData.role === 2 ? "employer" : "student");

      setSuccess("Qeydiyyat uğurlu oldu! Yönləndirilirsiniz...");

      setTimeout(() => {
        if (formData.role === 1) {
          router.push("/register/student/studentprofile");
        } else if (formData.role === 2) {
          router.push("/register/employer/employerprofile");
        } else {
          router.push("/");
        }
      }, 1500);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Qeydiyyat zamanı xəta baş verdi";
      setError(message.toLowerCase().includes("exist") ? "Bu istifadəçi artıq mövcuddur" : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-10">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-4">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Create {formData.role === 2 ? "Employer" : "Student"} Account
          </h1>
          <p className="text-slate-500 mt-2">Join our platform to start your journey.</p>
        </div>

        {/* STATUS MESSAGES */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-in fade-in zoom-in duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 text-emerald-600 text-sm animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* USERNAME */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="userName"
                type="text"
                placeholder="johndoe"
                value={formData.userName}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900"
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 px-1 leading-relaxed">
              Use 8+ characters with a mix of letters, numbers & symbols.
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-200 mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* LOGIN LINK */}
        <div className="text-center mt-8 pt-6 border-t border-slate-100">
          <p className="text-slate-500 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;