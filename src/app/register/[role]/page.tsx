"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { RegisterRequest } from "@/types/register";
import { UserRegister } from "@/services/Auth";

const Page = () => {
  const params = useParams();
  const router = useRouter();

  // ✅ PARAM SAFE (string | string[])
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

  // ✅ ROLE SET
  useEffect(() => {
    const roleValue = urlRole === "employer" ? 2 : 1;

    setFormData((prev) => ({
      ...prev,
      role: roleValue,
    }));
  }, [urlRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ PASSWORD VALIDATION
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
      setError(
        "Şifrə ən azı 8 simvol, 1 böyük hərf, 1 kiçik hərf, 1 rəqəm və 1 xüsusi simvol içerməlidir"
      );
      setLoading(false);
      return;
    }

    try {
      const result = await UserRegister(formData);

      // ✅ TOKEN
      localStorage.setItem("token", result.token);

      // ✅ ROLE STORAGE (BEST PRACTICE)
      localStorage.setItem("roleId", formData.role.toString());
      localStorage.setItem(
        "role",
        formData.role === 2 ? "employer" : "student"
      );

      setSuccess("Qeydiyyat uğurlu oldu!");

      // ✅ REDIRECT
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
      console.error("Xəta:", err.message);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Qeydiyyat zamanı xəta baş verdi";

      if (
        message.toLowerCase().includes("exist") ||
        message.toLowerCase().includes("already")
      ) {
        setError("Bu istifadəçi artıq mövcuddur");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4">
      <div className="w-full max-w-[540px] bg-white rounded-[24px] shadow-lg border border-[#E2E8F0] p-8 md:p-12">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold text-[#0F172A] mb-3">
            Create your {formData.role === 2 ? "Employer" : "Student"} Account
          </h1>
          <p className="text-[#64748B]">
            Complete your profile to get started.
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* NAME */}
          <div>
            <label className="text-sm font-semibold">Full Name</label>
            <input
              name="userName"
              type="text"
              value={formData.userName}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl border outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl border outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-semibold">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl border outline-none focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Minimum 8 simvol, böyük/kiçik hərf, rəqəm və xüsusi simvol
            </p>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex justify-center items-center gap-2"
          >
            {loading ? "Gözləyin..." : "Create Account"}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* MESSAGES */}
        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-center mt-4">{success}</p>
        )}

        {/* LOGIN */}
        <div className="text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;