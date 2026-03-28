"use client";

import { getLeaderboards, toggleOptIn } from "@/services/Leaderboard";
import React, { useEffect, useState } from "react";
import { Trophy, Medal, User, LogOut, UserPlus, Star, TrendingUp, Search, Loader2 } from "lucide-react";

const LeaderboardPage = () => {
  const [leaderboards, setLeaderboards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [optedIn, setOptedIn] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeaderboards = async () => {
    setLoading(true);
    try {
      const data = await getLeaderboards();
      setLeaderboards(data);
      const currentUser = data.find((u: any) => u.isCurrentUser);
      setOptedIn(!!currentUser); 
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaderboards(); }, []);

  const handleToggle = async () => {
    try {
      await toggleOptIn();
      await fetchLeaderboards();
    } catch (err: any) { alert("An error occurred"); }
  };

  // Filtration
  const filteredUsers = leaderboards.filter(u => 
    u.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topThree = filteredUsers.slice(0, 3);
  const restOfUsers = filteredUsers.slice(3);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-indigo-600 font-medium animate-pulse">Loading Leaderboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Header and Search Section */}
      <div className="bg-[#1E293B] pt-16 pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-400/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Season 1
                </span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">Top Performers</h1>
              <p className="text-slate-400 mt-2">Ranking based on interview scores</p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search students..."
                  className="w-full bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={handleToggle}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  optedIn ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25" 
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                }`}
              >
                {optedIn ? <LogOut size={18}/> : <UserPlus size={18}/>}
                <span className="hidden sm:inline">{optedIn ? "Opt Out" : "Join Now"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Podium Section (Top 3) */}
      <div className="max-w-5xl mx-auto px-6 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {topThree.map((user, index) => (
            <div key={user.rank} className={`relative flex flex-col items-center p-8 rounded-[2rem] shadow-2xl transition-transform hover:scale-105 bg-white ${index === 0 ? 'order-1 md:order-2 border-2 border-amber-400 md:-mt-6' : index === 1 ? 'order-2 md:order-1' : 'order-3'}`}>
              {index === 0 && <Trophy className="absolute -top-8 text-amber-400 w-16 h-16 drop-shadow-xl animate-bounce" />}
              
              <div className="relative mb-4">
                <img 
                  src={user.photoUrl || "https://ui-avatars.com/api/?name=" + user.fullname} 
                  alt={user.fullname}
                  className={`w-24 h-24 rounded-3xl object-cover border-4 ${index === 0 ? 'border-amber-100' : 'border-slate-100'}`}
                />
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-slate-300' : 'bg-orange-400'}`}>
                  {user.rank}
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-800 text-center line-clamp-1">{user.fullname}</h2>
              <p className="text-slate-500 text-sm mb-4">{user.targetJobName}</p>
              
              <div className="w-full bg-slate-50 rounded-2xl p-4 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Score</span>
                <span className="text-2xl font-black text-indigo-600">{user.averageInterviewScore}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* List Section */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <span className="font-bold text-slate-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" /> Full List
            </span>
            <span className="text-sm text-slate-400">{filteredUsers.length} Students</span>
          </div>

          <div className="divide-y divide-slate-50">
            {restOfUsers.map((user) => (
              <div key={user.rank} className="group flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-6">
                  <span className="w-6 text-center font-bold text-slate-300 group-hover:text-indigo-400 transition-colors">
                    {user.rank}
                  </span>
                  <div className="flex items-center gap-4">
                    <img 
                      src={user.photoUrl || "https://ui-avatars.com/api/?name=" + user.fullname} 
                      alt={user.fullname}
                      className="w-12 h-12 rounded-xl object-cover shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-slate-700 flex items-center gap-2">
                        {user.fullname}
                        {user.isCurrentUser && <span className="bg-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded-md uppercase font-black">You</span>}
                      </h4>
                      <p className="text-xs text-slate-400">{user.targetJobName}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden sm:block">
                    <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${user.averageInterviewScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right min-w-[60px]">
                    <span className="text-lg font-bold text-slate-700">{user.averageInterviewScore}</span>
                    <span className="text-[10px] text-slate-400 ml-1">pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;