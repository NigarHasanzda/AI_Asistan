"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Medal, Award, Flame, User, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { getLeaderboards, toggleOptIn } from "@/services/Leaderboard";

const LeaderboardSection = ({ targetJobId }: { targetJobId?: number }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [targetJobId]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const result = await getLeaderboards(targetJobId);
      setData(result.slice(0, 3));
    } catch (err) {
      console.error("Error fetching leaderboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-40">
        <div className="relative">
          <CircularProgress size={60} thickness={4} sx={{ color: "#6366f1" }} />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 animate-pulse" />
        </div>
      </div>
    );

  if (data.length === 0) return null;

  return (
    <section id="features" className="relative w-full max-w-8xl mx-auto py-24 px-6 overflow-hidden">
      {/* Arxa plan dekorasiyası */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
      
      {/* HEADER */}
      <div className="text-center mb-20 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm text-indigo-600 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] mb-6 border border-slate-100 animate-bounce">
          <Trophy className="w-4 h-4 text-amber-500" /> Leaderboard
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
          Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Talents</span>
        </h2>
      </div>

      {/* PODIUM SYSTEM */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-8 md:gap-4">
        
        {/* 2nd PLACE */}
        {data[1] && (
          <div className="order-2 md:order-1 w-full max-w-[400px] group">
            <div className="relative bg-white/70 backdrop-blur-md border border-white rounded-[2.5rem] p-8 flex flex-col items-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl">
               <div className="absolute top-6 right-6 text-slate-300 font-black text-4xl opacity-20 italic">#2</div>
               <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <Medal className="text-slate-500 w-7 h-7" />
               </div>
               <div className="relative">
                 <div className="w-24 h-24 rounded-3xl overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-500 border-4 border-white shadow-xl">
                   {data[1].photoUrl ? <img src={data[1].photoUrl} className="w-full h-full object-cover" /> : <div className="bg-slate-100 w-full h-full flex items-center justify-center"><User className="text-slate-300 w-10 h-10" /></div>}
                 </div>
               </div>
               <h3 className="mt-6 font-bold text-slate-800 text-xl text-center min-h-[50px]">{data[1].fullname}</h3>
               <div className="mt-4 flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-50">
                  <Flame className="text-orange-500 w-5 h-5 animate-pulse" />
                  <span className="font-black text-slate-700 text-lg">{data[1].averageInterviewScore?.toFixed(1)}</span>
               </div>
            </div>
          </div>
        )}

        {/* 1st PLACE (Kral) */}
        {data[0] && (
          <div className="order-1 md:order-2 w-full max-w-[430px] group z-10">
            <div className="relative bg-slate-900 rounded-[3rem] p-12 flex flex-col items-center shadow-[0_30px_60px_-15px_rgba(79,70,229,0.4)] transition-all duration-500 group-hover:-translate-y-4">
               {/* Sparkle effects */}
               <Sparkles className="absolute top-10 left-10 text-indigo-400/30 w-8 h-8 animate-pulse" />
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <Trophy className="text-white w-10 h-10 drop-shadow-md" />
               </div>
               
               <div className="relative mt-4">
                 <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-indigo-500/50 p-1 bg-slate-800">
                   {data[0].photoUrl ? <img src={data[0].photoUrl} className="w-full h-full object-cover rounded-[2.2rem]" /> : <div className="w-full h-full flex items-center justify-center"><User className="text-slate-600 w-12 h-12" /></div>}
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-lg shadow-lg">
                    <TrendingUp className="w-4 h-4" />
                 </div>
               </div>

               <h3 className="mt-8 font-black text-white text-2xl text-center leading-tight">{data[0].fullname}</h3>
               <p className="mt-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">{data[0].targetJobName || "Top Candidate"}</p>
               
               <div className="mt-8 flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 rounded-[2rem] shadow-[0_10px_25px_rgba(79,70,229,0.4)] border border-white/10">
                  <Flame className="text-amber-300 w-7 h-7 fill-amber-300" />
                  <span className="font-black text-white text-4xl tracking-tighter">{data[0].averageInterviewScore?.toFixed(1)}</span>
               </div>
            </div>
          </div>
        )}

        {/* 3rd PLACE */}
        {data[2] && (
          <div className="order-3 md:order-3 w-full max-w-[400px] group">
            <div className="relative bg-white/70 backdrop-blur-md border border-white rounded-[2.5rem] p-8 flex flex-col items-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl">
               <div className="absolute top-6 right-6 text-orange-200 font-black text-4xl opacity-20 italic">#3</div>
               <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <Award className="text-orange-400 w-7 h-7" />
               </div>
               <div className="w-24 h-24 rounded-3xl overflow-hidden -rotate-3 group-hover:rotate-0 transition-transform duration-500 border-4 border-white shadow-xl">
                 {data[2].photoUrl ? <img src={data[2].photoUrl} className="w-full h-full object-cover" /> : <div className="bg-slate-100 w-full h-full flex items-center justify-center"><User className="text-slate-300 w-10 h-10" /></div>}
               </div>
               <h3 className="mt-6 font-bold text-slate-800 text-xl text-center min-h-[50px]">{data[2].fullname}</h3>
               <div className="mt-4 flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-50">
                  <Flame className="text-orange-500 w-5 h-5" />
                  <span className="font-black text-slate-700 text-lg">{data[2].averageInterviewScore?.toFixed(1)}</span>
               </div>
            </div>
          </div>
        )}
      </div>

    </section>
  );
};

export default LeaderboardSection;