"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Upload, ArrowRight } from 'lucide-react';

const StudentRegister = () => {
  const [dragActive, setDragActive] = useState(false);

  // Drag and drop funksionallığı
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-between py-10 px-4 font-sans">
      <div className="w-full max-w-[1200px] flex justify-between items-center px-4 md:px-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#2563EB] transform rotate-45 flex items-center justify-center rounded-[4px]">
            <div className="w-2.5 h-2.5 bg-white transform -rotate-45" />
          </div>
          <span className="text-xl font-bold text-[#0F172A]">Kord AI</span>
        </div>
       
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[540px] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E8F0] p-8 md:p-12 my-8">
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold text-[#0F172A] mb-3">Create your Student Account</h1>
          <p className="text-[#64748B] leading-relaxed">
            Complete your profile to get started with AI-driven career growth.
          </p>
        </div>

        <form className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B]">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Alex Johnson"
              className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-[#94A3B8]"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B]">Email</label>
            <input 
              type="email" 
              placeholder="alex@university.edu"
              className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-[#94A3B8]"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B]">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-[#94A3B8]"
            />
          </div>

          {/* CV Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B]">Upload your CV</label>
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer
                ${dragActive ? "border-[#2563EB] bg-blue-50" : "border-[#E2E8F0] hover:border-blue-300"}`}
            >
              <Upload className="w-10 h-10 text-[#94A3B8] mb-3" />
              <p className="text-sm text-[#1E293B] font-medium">
                Drag & Drop CV or <span className="text-[#2563EB] hover:underline">Browse</span>
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">PDF, DOCX up to 10MB</p>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.docx" />
            </div>
          </div>

          {/* AI Helper Text */}
          <p className="text-sm text-center text-[#2563EB] font-medium cursor-pointer hover:underline">
            Don't have a CV? Skip and let AI build one for you.
          </p>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-[#1347FF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200"
          >
            Create Account <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-10 text-center text-sm text-[#64748B] font-medium border-t border-gray-100 pt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-[#2563EB] font-bold hover:underline">
            Log in
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <footer className="text-xs text-[#94A3B8]">
        © 2024 Kord AI Platforms Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default StudentRegister;