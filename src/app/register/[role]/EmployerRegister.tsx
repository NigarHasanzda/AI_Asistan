"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"; // useRouter əlavə edildi
import { ArrowRight } from "lucide-react";
import { RegisterRequest } from "@/types/register";
import { UserRegister } from "@/services/Auth";

const EmployerRegister = () => {
  const param = useParams();
  const router = useRouter(); // Router-i başladırıq
  const urlRole = param.role;

  const [formData, setFormData] = useState<RegisterRequest>({
    userName: "",
    email: "",
    password: "",
    role: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: urlRole === "employer" ? 2 : 1,
    }));
  }, [urlRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await UserRegister(formData);
    
      localStorage.setItem("token", result.token);

      setSuccess("Qeydiyyat uğurlu oldu!");

      // YÖNLƏNDİRMƏ MƏNTİQİ:
      // Əgər istifadəçi Tələbədirsə (role === 1), profil doldurma səhifəsinə göndər
      if (formData.role === 1) {
        // 1.5 saniyə gözləyib sonra yönləndiririk ki, istifadəçi uğur mesajını görsün
        setTimeout(() => {
          router.push("/register/student/studentprofile"); // Səhifənin adını öz router-inə uyğun dəyişə bilərsən
        }, 1500);
      } else {
        // İşəgötürən üçündürsə, başqa bir səhifəyə (məs: dashboard) yönləndirə bilərsən
        // router.push("/employer-dashboard");
      }

    } catch (err: any) {
      console.error("Xəta:", err.message);
      if (err.response?.data) {
        setError(err.response.data.message || "Məlumatlar düzgün deyil");
      } else {
        setError("Qeydiyyat zamanı xəta baş verdi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center py-10 px-4 font-sans">
      <div className="w-full max-w-[540px] bg-white rounded-[24px] shadow-lg border border-[#E2E8F0] p-8 md:p-12 my-8">
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold text-[#0F172A] mb-3">
            Create your {formData.role === 2 ? "Employer" : "Student"} Account
          </h1>
          <p className="text-[#64748B] leading-relaxed">
            Complete your profile to get started with AI-driven career growth.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Inputlar eynidir... */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B]">Full Name</label>
            <input
              name="userName"
              type="text"
              placeholder="e.g. Alex Johnson"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B]">Email</label>
            <input
              name="email"
              type="email"
              placeholder="alex@university.edu"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B]">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1347FF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            {loading ? "Gözləyin..." : "Create Account"} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center font-medium">{error}</p>}
        {success && <p className="text-green-500 mt-4 text-center font-medium">{success}</p>}

        <div className="mt-10 text-center text-sm text-[#64748B] font-medium border-t border-gray-100 pt-8">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#2563EB] font-bold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployerRegister;