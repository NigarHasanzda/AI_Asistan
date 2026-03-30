"use client";

import React, { useEffect, useState } from "react";
import { getAdminDashboard } from "@/services/Admin/Dashboard";
import { AdminDashboardResponse } from "@/types/Admin/dashboard";
import { 
  Users, Briefcase, GraduationCap, 
  Activity, LayoutDashboard,
  Zap, BarChart3, Layers, CheckCircle, XCircle, Clock, Star
} from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getAdminDashboard();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes("student")) return <GraduationCap size={20} className="text-blue-500" />;
    if (k.includes("company") && k.includes("approve")) return <CheckCircle size={20} className="text-emerald-500" />;
    if (k.includes("company") && k.includes("reject")) return <XCircle size={20} className="text-rose-500" />;
    if (k.includes("pending")) return <Clock size={20} className="text-amber-500" />;
    if (k.includes("premium")) return <Star size={20} className="text-purple-500" />;
    if (k.includes("company")) return <Briefcase size={20} className="text-indigo-500" />;
    if (k.includes("user")) return <Users size={20} className="text-slate-600" />;
    return <Activity size={20} className="text-slate-400" />;
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-[99%] mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              System <span className="text-blue-600">Overview</span>
            </h1>
            <p className="text-slate-500 mt-1 font-medium text-sm">Real-time metrics and platform engagement data.</p>
          </motion.div>

          <div className="flex items-center gap-4 bg-white shadow-sm border border-slate-200/60 p-3 rounded-2xl px-5">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-600">All Systems Operational</span>
             </div>
             <div className="h-4 w-[1px] bg-slate-200" />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data &&
            Object.entries(data).map(([key, value], index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={key}
                className="bg-white p-6 rounded-[2rem] border border-slate-200/50 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                    {getIcon(key)}
                  </div>
                  <BarChart3 size={16} className="text-slate-300" />
                </div>

                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                
                <h2 className="text-2xl font-black text-slate-900 mb-4">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </h2>

                {/* Dinamik Progress Bar (Statik faiz yerinə) */}
                <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.floor(Math.random() * 40) + 50}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
        </div>


      </div>
    </div>
  );
};

// Skeleton Loader
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#F8FAFC] p-10 animate-pulse">
    <div className="max-w-7xl mx-auto">
      <div className="h-10 w-48 bg-slate-200 rounded-xl mb-10" />
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 bg-white rounded-[2rem] border border-slate-200" />
        ))}
      </div>
    </div>
  </div>
);

export default AdminDashboard;