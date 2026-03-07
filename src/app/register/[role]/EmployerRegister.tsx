"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { RegisterRequest } from "@/types/register";
import { UserRegister } from "@/services/Auth";

const EmployerRegister = () => {
  const param = useParams(); // URL param-ları alır
  const urlRole = param.role; // /register/student və ya /register/employer

  const [formData, setFormData] = useState<RegisterRequest>({
    userName: "",
    email: "",
    password: "",
    role: 0, // default 0, sonra useEffect-də update olunacaq
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // URL-dən gələn role-u formData.role-a set edirik
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: urlRole === "employer" ? 1 : 0,
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
    console.log("Qeydiyyat uğurlu:", result);

    // 🔹 Token varsa localStorage-a yazırıq
    if (result.token) {
      localStorage.setItem("token", result.token);
      console.log("Token localStorage-a yazıldı:", result.token);
    }

    setSuccess("Qeydiyyat uğurlu oldu!");
  } catch (err: any) {
    console.error("Full error message:", err.message);
    if (err.response?.data) {
      console.log("Server cavabı:", err.response.data);
      setError(err.response.data.message || JSON.stringify(err.response.data));
    } else {
      setError("Qeydiyyat zamanı xəta baş verdi");
    }
  } finally {
    setLoading(false);
  }
};

  console.log("Form Data:", formData); // Debug üçün formData-nı konsola yazdırırıq
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center py-10 px-4 font-sans">
      <div className="w-full max-w-[540px] bg-white rounded-[24px] shadow-lg border border-[#E2E8F0] p-8 md:p-12 my-8">
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold text-[#0F172A] mb-3">
            Create your {formData.role === 0 ? "Student" : "Employer"} Account
          </h1>
          <p className="text-[#64748B] leading-relaxed">
            Complete your profile to get started with AI-driven career growth.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B]">Full Name</label>
            <input
              name="userName"
              type="text"
              placeholder="e.g. Alex Johnson"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none placeholder:text-[#94A3B8]"
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
              className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none placeholder:text-[#94A3B8]"
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
              className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none placeholder:text-[#94A3B8]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1347FF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200"
          >
            {loading ? "Gözləyin..." : "Create Account"} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}

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