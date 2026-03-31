"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Filter,
  Briefcase,
  User
} from "lucide-react";
import { getAdminApplications } from "@/services/Admin/Application";

const Page = () => {
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // FILTER STATES
  const [status, setStatus] = useState<string>("all");
  const [hasReason, setHasReason] = useState<string>("all");

  const pageSize = 10;

  // RESET FUNCTION
  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setHasReason("all");
    setPage(1);
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await getAdminApplications({
        keyword: search || undefined,
        status: status === "all" ? undefined : Number(status),
        hasRejectionReason: hasReason === "all" ? undefined : hasReason === "true",
        page,
        pageSize,
      });
      setApplications(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, status, hasReason]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchApplications();
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  // Helper for Status Badges
  const getStatusBadge = (statusStr: string) => {
    const styles: Record<string, string> = {
      Pending: "bg-amber-100 text-amber-700 border-amber-200",
      Accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Rejected: "bg-rose-100 text-rose-700 border-rose-200",
      Shortlisted: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return styles[statusStr] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen p-6 lg:p-10 bg-[#F8FAFC]">
      <div className="max-w-[95%] mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Applications</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <Briefcase size={16} /> Manage and review all internship submissions
            </p>
          </div>
          
          <button 
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm font-medium"
          >
            <RotateCcw size={18} />
            Reset Filters
          </button>
        </div>

        {/* FILTERS CARD */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Input */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by student or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Custom Status Dropdown */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer text-slate-700"
              >
                <option value="all">🎯 All Statuses</option>
                <option value="0">⏳ Pending</option>
                <option value="2">✅ Approved</option>
                <option value="3">❌ Rejected</option>
                <option value="1">⭐ Shortlisted</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Filter size={16} />
              </div>
            </div>

            {/* Reason Filter */}
            <div className="relative">
              <select
                value={hasReason}
                onChange={(e) => setHasReason(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer text-slate-700"
              >
                <option value="all">📝 Rejection Reason: All</option>
                <option value="true">With Reason</option>
                <option value="false">Without Reason</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Filter size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Student</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Internship & Company</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">Match Score</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Applied Date</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                        <p className="text-slate-500 font-medium">Loading applications...</p>
                      </div>
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                           <Search className="text-slate-300" size={30} />
                        </div>
                        <p className="text-slate-500 font-semibold text-lg">No results found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your filters or search terms.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  applications.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => router.push(`/admindashboard/application/${item.id}`)}
                      className="group hover:bg-slate-50/80 cursor-pointer transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={item.studentPhoto || "https://via.placeholder.com/40"}
                              className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                              alt="student"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{item.studentName}</p>
                            <p className="text-xs text-slate-400">ID: #{item.id.toString().slice(-4)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-slate-700 font-semibold leading-none mb-1">{item.internshipTitle}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          {item.companyName}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100">
                           <span className="text-indigo-700 font-extrabold text-sm">{item.overallMatchScore}%</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-slate-600 text-sm font-medium">{item.appliedAt}</span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION SECTION */}
        <div className="flex items-center justify-between mt-8 px-2">
          <p className="text-sm text-slate-500 font-medium">
            Page <span className="text-slate-900">{page}</span>
          </p>
          
          <div className="flex gap-2">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              disabled={applications.length < pageSize || loading}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;