"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/services/ForgotPassword";
import { Lock, ShieldCheck, Loader2, CheckCircle2, ChevronLeft, KeyRound } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword({
        email,
        code,
        newPassword,
        confirmPassword,
      });

      toast.success(res.message || "Password updated successfully!", {
        icon: '🚀',
        duration: 3000
      });

      // 3 saniyə sonra giriş səhifəsinə yönləndir
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      toast.error(err.message || "Invalid code or session expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 font-sans">
      <Toaster position="top-center" />

      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all group"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="w-full max-w-[480px] bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        {/* Top Decorative Circle */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[5rem] -z-0 opacity-60" />

        <div className="relative z-10">
          {/* Icon Header */}
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-100">
            <ShieldCheck className="text-white" size={28} />
          </div>

          <div className="space-y-3 mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Create New <br /> <span className="text-indigo-600">Password</span>
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Enter the 6-digit code we sent to your email and choose a strong new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Registered Email</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* OTP Code Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">6-Digit Reset Code</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="text"
                  placeholder="000 000"
                  maxLength={6}
                  className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-indigo-600 tracking-[0.3em]"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black hover:bg-indigo-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-slate-200 disabled:opacity-70 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Update Password
                  <CheckCircle2 size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <p className="mt-8 text-center text-xs text-slate-400 font-medium">
            Remembered your password? <span onClick={() => router.push("/login")} className="text-indigo-600 font-bold cursor-pointer hover:underline">Back to Login</span>
          </p>
        </div>
      </div>
      
      {/* Security Badge */}
      <div className="mt-8 flex items-center gap-2 opacity-30 grayscale">
        <ShieldCheck size={16} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">End-to-End Encrypted</span>
      </div>
    </div>
  );
};

export default ResetPasswordPage;