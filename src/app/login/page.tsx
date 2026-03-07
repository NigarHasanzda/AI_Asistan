"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/types/login";
import { UserLogin } from "@/services/Login";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const loginData: LoginRequest = {
      usernameOrEmail: email,
      password: password,
    };

    try {
      await UserLogin(loginData);
      // Login uğurlu olduqda, home page yönləndir
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-[100px] flex bg-[linear-gradient(90deg,#D1DCFF_0%,#FFFFFF_50%)] font-sans">
      {/* Sol info panel */}
      <div className="hidden lg:flex lg:w-[45%]  p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px]  rounded-full blur-[120px] opacity-50" />
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3D13FF] rotate-45 flex items-center justify-center rounded-[4px]">
            <div className="w-3 h-3 bg-white -rotate-45" />
          </div>
          <span className="text-xl font-bold text-[#0F172A]">Kord AI</span>
        </div>
        <div className="relative z-10">
          <h1 className="text-[64px] font-extrabold text-[#0F172A] leading-[1.1] mb-8 tracking-tight">
            Harmonize Your <br /> Career Path
          </h1>
          <p className="text-[#64748B] text-xl leading-relaxed max-w-[480px]">
            Elevate your professional journey with precision-engineered AI tools
            designed for modern career growth and strategic skill mapping.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
              >
                <img
                  src={`https://i.pravatar.cc/100?u=${i}`}
                  alt="user"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-[#64748B]">
            Joined by 10k+ professionals
          </span>
        </div>
      </div>

      {/* Sağ login panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F8F9FB] lg:bg-white">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-10">
            <h2 className="text-[32px] font-bold text-[#0F172A] mb-2">
              Welcome Back
            </h2>
            <p className="text-[#64748B]">Enter your credentials to access your portal</p>
          </div>

          <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1E293B]">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#3D13FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-[#94A3B8]"
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
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#3D13FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-[#94A3B8]"
                    required
                  />
                  <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] cursor-pointer" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3D13FF] hover:bg-[#310ed9] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-100 mt-2"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              {/* Or continue with */}
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-[#E2E8F0]"></div>
                <span className="mx-4 text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider whitespace-nowrap">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-[#E2E8F0]"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 py-3 border border-[#E2E8F0] rounded-xl hover:bg-gray-50 transition-all font-bold text-sm text-[#1E293B]">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-3 border border-[#E2E8F0] rounded-xl hover:bg-gray-50 transition-all font-bold text-sm text-[#1E293B]">
                  <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="w-5 h-5" alt="linkedin" />
                  LinkedIn
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-[#64748B]">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#3D13FF] font-bold hover:underline">Register here</Link>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-6 text-[12px] text-[#94A3B8] font-medium">
            <Link href="#" className="hover:text-[#64748B]">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#64748B]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}