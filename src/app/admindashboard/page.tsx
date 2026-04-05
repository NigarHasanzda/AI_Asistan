"use client";

import React, { useEffect, useState } from "react";
import { getAdminDashboard } from "@/services/Admin/Dashboard";
import { AdminDashboardResponse } from "@/types/Admin/dashboard";
import { 
  Users, Briefcase, GraduationCap, 
  Activity, CheckCircle, XCircle, Clock, Star,
  TrendingUp, BarChart3, LayoutDashboard, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell,
  PieChart, Pie,
} from 'recharts';

const AdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getAdminDashboard();
        setData(res);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // API-dən gələn hər bir key üçün uyğun ikon və rəng təyin edirik
  const getMetadata = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes("student")) return { icon: <GraduationCap size={22}/>, color: "#3B82F6", bg: "bg-blue-50" };
    if (k.includes("company") && k.includes("approve")) return { icon: <CheckCircle size={22}/>, color: "#10B981", bg: "bg-emerald-50" };
    if (k.includes("company") && k.includes("reject")) return { icon: <XCircle size={22}/>, color: "#EF4444", bg: "bg-rose-50" };
    if (k.includes("pending")) return { icon: <Clock size={22}/>, color: "#F59E0B", bg: "bg-amber-50" };
    if (k.includes("premium")) return { icon: <Star size={22}/>, color: "#8B5CF6", bg: "bg-purple-50" };
    if (k.includes("user")) return { icon: <Users size={22}/>, color: "#64748B", bg: "bg-slate-50" };
    return { icon: <Activity size={22}/>, color: "#6366F1", bg: "bg-indigo-50" };
  };

  // Chart üçün API datasını massivə çeviririk (Yalnız rəqəm tipli datalar)
  const chartFormatData = data 
    ? Object.entries(data)
        .filter(([_, value]) => typeof value === 'number')
        .map(([key, value]) => ({
          name: key.replace(/([A-Z])/g, ' $1').trim(),
          value: value as number,
        }))
    : [];

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12 font-sans text-slate-800">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Platform <span className="text-blue-600">Metrics</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Real-time data visualization of all system entities.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Live API Feed Active</span>
          </div>
        </header>

        {/* --- MAIN BENTO GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* STAT CARDS - API-dən gələn hər şey bura düşür */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {data && Object.entries(data).map(([key, value], index) => {
                const meta = getMetadata(key);
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 ${meta.bg} rounded-2xl`} style={{ color: meta.color }}>
                        {meta.icon}
                      </div>
                      <BarChart3 size={18} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                    </div>
                    
                    <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-black text-slate-900 leading-none">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                      </span>
                    </div>

                    {/* DYNAMIC PROGRESS BAR BASED ON DATA VALUE */}
                    <div className="mt-6 w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }} // Bu hissəni hədəf rəqəmə görə dəyişə bilərsən
                        className="h-full rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* DYNAMIC CHART SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white h-full flex flex-col">
              <div className="mb-8">
                <div className="p-3 bg-white/10 w-fit rounded-2xl mb-4">
                  <Zap className="text-amber-400" size={24} fill="currentColor" />
                </div>
                <h4 className="text-2xl font-black">Data Ratio</h4>
                <p className="text-slate-400 text-sm mt-2 font-medium">Visual distribution of system records.</p>
              </div>

              {/* DYNAMIC BAR CHART FROM API DATA */}
              <div className="flex-grow min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartFormatData}>
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-xl shadow-xl">
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{payload[0].payload.name}</p>
                              <p className="text-slate-900 font-black">{payload[0].value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                      {chartFormatData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getMetadata(entry.name).color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Entities</span>
                  <span className="text-xl font-black">
                    {chartFormatData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Skeleton Loader
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#F8FAFC] p-12 animate-pulse">
    <div className="max-w-[1600px] mx-auto space-y-10">
      <div className="h-16 w-1/3 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 grid grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-white rounded-[2.5rem]" />)}
        </div>
        <div className="col-span-1 h-full bg-slate-200 rounded-[2.5rem]" />
      </div>
    </div>
  </div>
);

export default AdminDashboard;