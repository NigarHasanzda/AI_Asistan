"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/services/ForgotPassword";
import { Mail, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await forgotPassword({ email });
      
      // Uğurlu bildiriş
      toast.success(res.message || "Email sent! Please check your inbox.", {
        duration: 4000,
        icon: '📧',
        style: {
          borderRadius: '16px',
          background: '#333',
          color: '#fff',
          fontWeight: 'bold'
        },
      });

      // 3 saniyə sonra Reset Password səhifəsinə yönləndirmə
      setTimeout(() => {
        router.push("/reset-password");
      }, 3000);

    } catch (err: any) {
      toast.error(err.message || "An error occurred. Please try again.", {
        style: {
          borderRadius: '16px',
          fontWeight: 'bold'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Back to Login Button */}
      <button 
        onClick={() => router.push("/login")}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all group"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Login
      </button>

      <div className="w-full max-w-[450px] bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[5rem] -z-0 opacity-60" />

        <div className="relative z-10">
          {/* Icon Header */}
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-100">
            <Mail className="text-white" size={28} />
          </div>

          <div className="space-y-3 mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Forgot <br /> <span className="text-indigo-600">Password?</span>
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              No worries! Enter your email below and we'll send you a 6-digit code to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" 
                  size={20} 
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold placeholder:text-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black hover:bg-indigo-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Send Reset Instructions
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Help Text */}
          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Having trouble? <span className="text-indigo-600 cursor-pointer font-bold hover:underline">Contact Support</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <p className="mt-8 text-slate-300 text-xs font-black uppercase tracking-[0.3em]">
        Secure Identity Management
      </p>
    </div>
  );
};

export default ForgotPasswordPage;