"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Target, BarChart3, Fingerprint, Sparkles } from 'lucide-react';

const WhyChooseUs = () => {
  const router = useRouter();
  const [role, setRole] = useState("guest");
  const [mounted, setMounted] = useState(false);

  // Rolun yoxlanılması
  useEffect(() => {
    setMounted(true);
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole.toLowerCase());
    }
  }, []);

  const handleRedirect = () => {
    switch (role) {
      case "admin":
        router.push("/admindashboard");
        break;
      case "student":
        router.push("/userdashboard");
        break;
      case "company":
      case "employer":
        router.push("/dashboard");
        break;
      default:
        router.push("/auth/login");
        break;
    }
  };

  const points = [
    {
      title: "Personalized Roadmaps",
      description: "Every user gets a custom path based on their specific goals and current skill level.",
      icon: <Target className="w-5 h-5" />
    },
    {
      title: "Real-time Feedback",
      description: "No more waiting. Get instant CV scores and interview performance reports within seconds.",
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      title: "Match Score Tech",
      description: "Our proprietary algorithm matches candidates to roles with a 92% success rate.",
      icon: <Fingerprint className="w-5 h-5" />
    }
  ];

  return (
    <section id="about" className="w-full py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* LEFT SIDE: Visual Content */}
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />

          <div className="relative z-10 bg-slate-50 p-3 md:p-6 rounded-[48px] border border-slate-100 shadow-sm">
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl bg-white border border-slate-200/50">
              <img 
                src="/image.png" 
                alt="Kord AI Dashboard"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white flex items-center gap-3 animate-bounce [animation-duration:3s]">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                   <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Match Rate</p>
                  <p className="text-lg font-black text-slate-900">92.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Text & Features */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
              The Kord AI Advantage
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">
              Why Choose <span className="text-indigo-600">Kord AI?</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
              We don't just find jobs; we build careers through a systematic, 
              AI-driven approach that evolves with you.
            </p>
          </div>

          <div className="space-y-4">
            {points.map((point, index) => (
              <div 
                key={index} 
                className="group flex items-start gap-5 p-6 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all duration-300">
                  {point.icon}
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {point.title}
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base font-medium">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
             <button 
               onClick={handleRedirect}
               className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
             >
               {mounted && role !== "guest" ? "Go to My Dashboard" : "Start Your Journey"}
             </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;