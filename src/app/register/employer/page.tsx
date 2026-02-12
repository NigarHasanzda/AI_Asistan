"use client";

import React from 'react';
import Link from 'next/link';
import { Briefcase, Eye, ArrowRight } from 'lucide-react';

const EmployerRegister = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-between py-8 px-4 font-sans">
      {/* Header */}
      <div className="w-full max-w-[1200px] flex justify-between items-center px-4 md:px-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1347FF] transform rotate-45 flex items-center justify-center rounded-[4px]">
            <div className="w-2.5 h-2.5 bg-white transform -rotate-45" />
          </div>
          <span className="text-xl font-bold text-[#0F172A]">Kord AI</span>
        </div>
        <span className="text-sm text-[#64748B] font-medium cursor-pointer hover:text-blue-600 transition-colors">
          Employer Portal
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[580px] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E8F0] overflow-hidden my-8">
        <div className="p-8 md:p-12">
          {/* Icon & Title */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-6">
              <Briefcase className="w-8 h-8 text-[#1347FF]" />
            </div>
            <h1 className="text-[32px] font-bold text-[#0F172A] mb-2">Join as Employer</h1>
            <p className="text-[#64748B]">Scale your team with AI-driven talent insights</p>
          </div>

          <form className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1E293B]">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#1347FF] focus:ring-2 focus:ring-blue-50 outline-none transition-all placeholder:text-[#94A3B8]"
              />
            </div>

            {/* Company & Industry (Row) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1E293B]">Company Name</label>
                <input 
                  type="text" 
                  placeholder="Acme Inc"
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#1347FF] focus:ring-2 focus:ring-blue-50 outline-none transition-all placeholder:text-[#94A3B8]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1E293B]">Industry</label>
                <select className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white focus:border-[#1347FF] focus:ring-2 focus:ring-blue-50 outline-none transition-all text-[#94A3B8] appearance-none cursor-pointer">
                  <option value="">Select industry</option>
                  <option value="tech">Technology</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
            </div>

            {/* Corporate Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1E293B]">Corporate Email</label>
              <input 
                type="email" 
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#1347FF] focus:ring-2 focus:ring-blue-50 outline-none transition-all placeholder:text-[#94A3B8]"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1E293B]">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#1347FF] focus:ring-2 focus:ring-blue-50 outline-none transition-all placeholder:text-[#94A3B8]"
                />
                <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] cursor-pointer" />
              </div>
              <p className="text-[11px] text-[#94A3B8]">Must be at least 8 characters long</p>
            </div>

            {/* Terms & Privacy */}
            <div className="flex items-start gap-3 pt-2">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#E2E8F0] text-[#1347FF] focus:ring-[#1347FF] cursor-pointer" />
              <p className="text-xs text-[#64748B] leading-tight">
                By creating an account, you agree to Kord AI's{' '}
                <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link> and{' '}
                <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-[#1347FF] hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 mt-4"
            >
              Create Employer Account <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Footer Login Link */}
        <div className="bg-[#F8F9FB] py-6 text-center text-sm text-[#64748B] font-medium border-t border-[#E2E8F0]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#1347FF] font-bold hover:underline">
            Login here
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <footer className="text-[10px] text-[#94A3B8] uppercase tracking-widest">
        © 2024 KORD AI SYSTEMS. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};

export default EmployerRegister;