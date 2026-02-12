"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterSelection = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center px-4 py-12 font-sans">
      {/* Logo Section */}
      <div className="absolute top-10 left-10 flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
        <div className="w-8 h-8 bg-[#2563EB] transform rotate-45 flex items-center justify-center rounded-[4px]">
          <div className="w-3 h-3 bg-white transform -rotate-45" />
        </div>
        <span className="text-xl font-bold text-[#0F172A] tracking-tight">Kord AI</span>
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mb-16"
      >
        <h1 className="text-[40px] font-bold text-[#0F172A] mb-4 tracking-tight">
          Join Kord AI
        </h1>
        <p className="text-[#64748B] text-lg font-medium">
          Choose your role to get started with your premium career journey
        </p>
      </motion.div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[960px]">
        
        {/* Student Card */}
        <motion.div
          whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)' }}
          onClick={() => handleNavigation('/register/student')}
          className="group relative bg-white border border-[#E2E8F0] p-12 rounded-[24px] cursor-pointer transition-all duration-300 hover:border-[#2563EB]"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#2563EB] transition-colors duration-300">
              <GraduationCap className="w-8 h-8 text-[#2563EB] group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-4">I am a Student</h2>
            <p className="text-[#64748B] leading-relaxed max-w-[240px]">
              Find your dream job and accelerate your career growth.
            </p>
          </div>
        </motion.div>

        {/* Employer Card */}
        <motion.div
          whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)' }}
          onClick={() => handleNavigation('/register/employer')}
          className="group relative bg-white border border-[#E2E8F0] p-12 rounded-[24px] cursor-pointer transition-all duration-300 hover:border-[#2563EB]"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#2563EB] transition-colors duration-300">
              <Briefcase className="w-8 h-8 text-[#2563EB] group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-4">I am an Employer</h2>
            <p className="text-[#64748B] leading-relaxed max-w-[240px]">
              Source the best talent with AI-driven matching.
            </p>
          </div>
        </motion.div>

      </div>

      {/* Bottom Link */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-[#64748B] font-medium"
      >
        Already have an account?{' '}
        <button 
          onClick={() => handleNavigation('/auth/login')}
          className="text-[#2563EB] font-bold hover:underline underline-offset-4"
        >
          Login here
        </button>
      </motion.p>
    </div>
  );
};

export default RegisterSelection;