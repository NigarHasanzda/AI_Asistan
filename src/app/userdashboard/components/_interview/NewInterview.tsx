"use client";

import React, { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { 
  Code2, 
  Users2, 
  Layers, 
  Sparkles, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Cpu
} from "lucide-react";

const NewInterview = () => {
  const router = useRouter();

  const [mode, setMode] = useState<"Technical" | "Behavioral" | "Mixed">("Technical");
  const [difficulty, setDifficulty] = useState<"Intern" | "Junior" | "Senior">("Junior");
  const [loading, setLoading] = useState(false);

  const modes = [
    {
      id: "Technical",
      icon: Code2,
      title: "Technical",
      desc: "Deep dive into Algorithms, Data Structures and System Architecture.",
      color: "text-blue-600",
      bg: "bg-blue-50",
      ring: "ring-blue-100",
    },
    {
      id: "Behavioral",
      icon: Users2,
      title: "Behavioral",
      desc: "Focus on Leadership, Soft Skills and Cultural Adaptability.",
      color: "text-orange-600",
      bg: "bg-orange-50",
      ring: "ring-orange-100",
    },
    {
      id: "Mixed",
      icon: Layers,
      title: "Mixed Mode",
      desc: "A comprehensive 360° simulation covering all aspects.",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      ring: "ring-indigo-100",
    },
  ];

  const handleLaunch = async () => {
    setLoading(true);

    const modeMap: Record<string, number> = { Behavioral: 0, Technical: 1, Mixed: 2 };
    const levelMap: Record<string, number> = { Intern: 0, Junior: 1, Senior: 2 };

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/MockInterviews",
        { 
          mode: modeMap[mode], 
          level: levelMap[difficulty], 
          role: "General Software Engineer" // Role-u avtomatik təyin edirik
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        router.push(`/userdashboard/interviews/${response.data}`);
      }
    } catch (error) {
      console.error("Launch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 lg:p-2">
      
      {/* Subtle Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] right-[-5%] w-[45%] h-[45%] bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-5%] w-[45%] h-[45%] bg-blue-50/50 rounded-full blur-[120px]" />
      </div>

      <main className="relative w-full max-w-7xl">
        <div className="bg-white/70 backdrop-blur-2xl border border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] rounded-[56px] p-8 lg:p-16">
          
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* LEFT: MODE SELECTION */}
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  <Sparkles size={12} fill="currentColor" />
                  Instant Simulation
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Choose Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 italic">Interview Mode</span>
                </h1>
              </div>

              <div className="space-y-4">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    className={`w-full flex items-center gap-6 p-6 rounded-[32px] border-2 transition-all duration-300 group ${
                      mode === m.id 
                      ? `border-indigo-600 bg-white shadow-2xl ${m.ring} ring-8` 
                      : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                    }`}
                  >
                    <div className={`w-14 h-14 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0`}>
                      <m.icon size={28} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-lg font-bold text-slate-900">{m.title}</h4>
                      <p className="text-sm text-slate-400 font-medium leading-snug">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: LEVEL & LAUNCH */}
            <div className="flex flex-col gap-10">
              
              {/* Seniority Selector */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                   <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-lg">
                      <Cpu size={16} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 tracking-tight">Select Experience</h3>
                </div>

                <div className="bg-slate-100/80 p-1.5 rounded-[28px] grid grid-cols-3 gap-1.5 border border-slate-200/50">
                  {["Intern", "Junior", "Senior"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d as any)}
                      className={`py-4 rounded-[22px] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                        difficulty === d 
                        ? "bg-white text-indigo-600 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.2)] scale-[1.02]" 
                        : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status & Preview */}
              <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group min-h-[180px] flex flex-col justify-center">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-700" />
                 
                 <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 text-indigo-400">
                       <ShieldCheck size={20} />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Ready</span>
                    </div>
                    <h2 className="text-2xl font-bold">Initializing {mode} <br /> Simulation for {difficulty}</h2>
                    <p className="text-slate-400 text-xs font-medium">AI will generate custom questions based on your selection.</p>
                 </div>
              </div>

              {/* ACTION */}
              <div>
                <button
                  onClick={handleLaunch}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-7 rounded-[32px] font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-2 active:scale-95 disabled:opacity-50 group"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Generate Interview</span>
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </>
                  )}
                </button>
                <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <Zap size={14} className="text-amber-400" fill="currentColor" />
                  Simulations take 5-10 seconds to build
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default NewInterview;