"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; // EyeOff əlavə edildi
import { useRouter } from "next/navigation";
import { UserLogin } from "@/services/Login";

export default function LoginPage() {
  const router = useRouter();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Şifrəni göstər/gizlə üçün
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await UserLogin({ usernameOrEmail, password });
      const role = res.role;

      switch (role) {
        case 0: router.push("/admin/dashboard"); break;
        case 1: router.push("/dashboard"); break;
        case 2: router.push("/empdashboard"); break;
        default: router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // px-[100px] yerinə responsive padding (lg:px-24) əlavə edildi
    <div className="min-h-screen flex flex-col lg:flex-row bg-[linear-gradient(90deg,#D1DCFF_0%,#FFFFFF_50%)] font-sans lg:px-12 xl:px-24">
      
      {/* Sol info panel - Mobildə gizli, LG-dən etibarən blok */}
      <div className="hidden lg:flex lg:w-[45%] p-8 xl:p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-50 bg-[#D1DCFF]" />
        
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3D13FF] rotate-45 flex items-center justify-center rounded-[4px]">
            <div className="w-3 h-3 bg-white -rotate-45" />
          </div>
          <span className="text-xl font-bold text-[#0F172A]">Kord AI</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl xl:text-[64px] font-extrabold text-[#0F172A] leading-[1.1] mb-8 tracking-tight">
            Harmonize Your <br className="hidden xl:block" /> Career Path
          </h1>
          <p className="text-[#64748B] text-lg xl:text-xl leading-relaxed max-w-[480px]">
            Elevate your professional journey with precision-engineered AI tools
            designed for modern career growth.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-[#64748B]">Joined by 10k+ professionals</span>
        </div>
      </div>

      {/* Sağ login panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-8 bg-transparent">
        <div className="w-full max-w-[420px]">
          {/* Logo Mobildə görünsün deyə (Könüllü) */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-6 h-6 bg-[#3D13FF] rotate-45 flex items-center justify-center rounded-[3px]">
               <div className="w-2 h-2 bg-white -rotate-45" />
            </div>
            <span className="text-lg font-bold text-[#0F172A]">Kord AI</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-[32px] font-bold text-[#0F172A] mb-2">Welcome Back</h2>
            <p className="text-[#64748B] text-sm sm:text-base">Enter your credentials to access your portal</p>
          </div>

          <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg text-center">{error}</p>}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1E293B]">Username or Email</label>
                <input
                  type="text"
                  placeholder="username or name@company.com"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#3D13FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-[#94A3B8] text-sm sm:text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#1E293B]">Password</label>
                  <Link href="#" className="text-xs font-bold text-[#3D13FF] hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#3D13FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-[#94A3B8] text-sm sm:text-base"
                    required
                  />
                  <div 
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#94A3B8] hover:text-[#3D13FF] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3D13FF] hover:bg-[#310ed9] text-white font-bold py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-blue-100 mt-2 disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-[#64748B]">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#3D13FF] font-bold hover:underline">Register here</Link>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-6 text-[11px] sm:text-[12px] text-[#94A3B8] font-medium">
            <Link href="#" className="hover:text-[#64748B]">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#64748B]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}