"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, ArrowRight, Sparkles, CheckCircle, BarChart, Zap } from 'lucide-react';

const HeroSection = () => {
  const router = useRouter();
  // Initialize with "guest" to avoid null-related render errors
  const [role, setRole] = useState("guest");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole.toLowerCase());
    }
  }, []);

  const handleRedirect = () => {
    // Standardizing roles to lowercase to prevent mismatch errors
    const currentRole = role.toLowerCase();

    if (currentRole === "admin") {
      router.push("/admindashboard/profile");
    } else if (currentRole === "student") {
      router.push("/userdashboard/interviews");
    } else if (currentRole === "company" || currentRole === "employer") {
      router.push("/dashboard/listings");
    } else {
      router.push("/auth/login");
    }
  };

  // Prevent hydration mismatch by not rendering buttons dependent on role until mounted
  return (
    <section className="relative w-full min-h-screen bg-white flex items-center justify-center overflow-hidden px-6 py-20 lg:px-24">
      
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-blue-50 rounded-full blur-[80px]"></div>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10">
        
        {/* LEFT SIDE */}
        <div className="flex flex-col space-y-7 text-center lg:text-left">
          <div className="inline-flex items-center mx-auto lg:mx-0 w-fit px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
            <Sparkles className="w-4 h-4 text-indigo-600 mr-2" />
            <span className="text-[12px] font-bold text-indigo-600 tracking-wider uppercase">
              Shape Your Future with AI
            </span>
          </div>

          <h1 className="text-[40px] sm:text-[52px] lg:text-[72px] font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Smart Transition <br />
            From Education <br />
            <span className="text-indigo-600">To Career.</span>
          </h1>

          <p className="text-slate-600 text-lg md:text-xl max-w-[540px] mx-auto lg:mx-0 leading-relaxed font-medium">
            Get one step closer to your dream job with KordAi. Discover your true potential 
            using AI roadmaps, instant CV analysis, and real-time interview simulations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button 
              onClick={handleRedirect}
              className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
            >
              {mounted && role !== "guest" ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="w-5 h-5" />
            </button>

            <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-2xl transition-all border border-slate-200">
              <Play className="w-4 h-4 fill-indigo-600 text-indigo-600" />
              Watch Demo
            </button>
          </div>

          <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-6">
            {['AI Roadmap', 'CV Score', 'Mock Interviews'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE (DASHBOARD VISUAL) */}
        <div className="relative">
          <div className="relative bg-slate-50 rounded-[40px] border border-slate-200 p-4 shadow-2xl">
            <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="h-2 w-20 bg-slate-100 rounded-full"></div>
                    <div className="h-3 w-32 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <BarChart className="w-4 h-4 text-indigo-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-indigo-600 rounded-2xl text-white">
                    <p className="text-[10px] opacity-80 uppercase font-bold tracking-widest text-white">Career Readiness</p>
                    <p className="text-2xl font-bold mt-1 text-white">92%</p>
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Active Openings</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">14</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border border-slate-100"></div>
                        <div className="space-y-1">
                          <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                          <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
                        </div>
                      </div>
                      <div className="h-2 w-12 bg-indigo-200 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Widget */}
          <div className="absolute -top-6 -left-6 md:-left-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce [animation-duration:5s]">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Analysis Ready</p>
              <p className="text-sm font-bold text-slate-900">Your CV is top 10%!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;