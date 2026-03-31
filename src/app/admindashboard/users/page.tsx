"use client";

import React, { useEffect, useState } from "react";
import { getAdminUsers, banUser, unbanUser } from "@/services/Admin/Users";
import { toast, Toaster } from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Ban,
  CheckCircle2,
  XCircle,
  Search,
  RotateCcw,
  ShieldCheck,
  Unlock,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const Page = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal states
  const [banModal, setBanModal] = useState<{ open: boolean; user: any }>({ open: false, user: null });
  const [unbanModal, setUnbanModal] = useState<{ open: boolean; user: any }>({ open: false, user: null });
  const [banReason, setBanReason] = useState("");

  // Filter states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isBanned, setIsBanned] = useState<string>("all");
  const [isProfileCompleted, setIsProfileCompleted] = useState<string>("all");

  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, [page, isBanned, isProfileCompleted]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers({
        page,
        pageSize,
        keyword: search || undefined,
        isBanned: isBanned === "all" ? undefined : isBanned === "true",
        isProfileCompleted: isProfileCompleted === "all" ? undefined : isProfileCompleted === "true",
      });
      setUsers(Array.isArray(res) ? res : []);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async () => {
    const userId = banModal.user?.id;
    if (!userId || !banReason.trim()) return;

    try {
      setActionLoading(userId);
      await banUser(userId, banReason);
      toast.success("User has been banned");
      setBanModal({ open: false, user: null });
      setBanReason("");
      fetchUsers();
    } catch (error) {
      toast.error("An error occurred while banning");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnban = async () => {
    const userId = unbanModal.user?.id;
    if (!userId) return;

    try {
      setActionLoading(userId);
      await unbanUser(userId);
      toast.success("User access restored");
      setUnbanModal({ open: false, user: null });
      fetchUsers();
    } catch (error) {
      toast.error("An error occurred while unbanning");
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleStyle = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin": return "bg-rose-50 text-rose-700 border-rose-100";
      case "company": return "bg-violet-50 text-violet-700 border-violet-100";
      default: return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 text-slate-800 relative">
      <Toaster position="top-right" />
      
      <div className="max-w-[97%] mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">User Management</h1>
          <button
            onClick={() => { setSearch(""); setIsBanned("all"); setIsProfileCompleted("all"); setPage(1); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-sm font-semibold"
          >
            <RotateCcw size={16} /> Reset Filters
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by username or email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={isBanned} onChange={(e) => setIsBanned(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium cursor-pointer">
            <option value="all">Status: All</option>
            <option value="true">Banned</option>
            <option value="false">Active</option>
          </select>
          <select value={isProfileCompleted} onChange={(e) => setIsProfileCompleted(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium cursor-pointer">
            <option value="all">Profile: All</option>
            <option value="true">Completed</option>
            <option value="false">Incomplete</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Profile</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400 font-medium">
                        <Loader2 className="animate-spin" size={24} />
                        Loading users...
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-400">No users found.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">@{user.username}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border tracking-wider uppercase ${getRoleStyle(user.role)}`}>{user.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isProfileCompleted ? (
                          <span className="text-emerald-600 flex items-center gap-1 font-medium"><CheckCircle2 size={14} /> Done</span>
                        ) : (
                          <span className="text-amber-500 flex items-center gap-1 font-medium"><XCircle size={14} /> Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user.isBanned ? (
                          <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold border border-red-100">BANNED</span>
                        ) : (
                          <span className="text-emerald-500 font-medium flex items-center gap-1"><ShieldCheck size={14} /> Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {actionLoading === user.id ? (
                          <Loader2 className="animate-spin ml-auto text-slate-400" size={18} />
                        ) : user.isBanned ? (
                          <button
                            onClick={() => setUnbanModal({ open: true, user })}
                            className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                            title="Unban User"
                          >
                            <Unlock size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setBanModal({ open: true, user })}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                            title="Ban User"
                          >
                            <Ban size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)} 
            className="p-2 border border-slate-200 rounded-xl disabled:opacity-30 bg-white hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-sm text-slate-600">Page {page}</span>
          <button 
            disabled={users.length < pageSize} 
            onClick={() => setPage(p => p + 1)} 
            className="p-2 border border-slate-200 rounded-xl disabled:opacity-30 bg-white hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* BAN MODAL */}
      {banModal.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-red-600 mb-2 flex items-center gap-2">
              <Ban size={22} /> Ban User
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Please provide a reason for banning <span className="font-bold text-slate-700">@{banModal.user?.username}</span>.
            </p>
            <textarea
              className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 h-32 resize-none transition-all"
              placeholder="E.g., Suspicious activity, Violation of terms..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setBanModal({ open: false, user: null }); setBanReason(""); }}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!banReason.trim() || actionLoading === banModal.user?.id}
                onClick={handleBan}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex justify-center items-center"
              >
                {actionLoading === banModal.user?.id ? <Loader2 size={18} className="animate-spin" /> : "Confirm Ban"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNBAN MODAL */}
      {unbanModal.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Restore User Access?</h2>
            <p className="text-sm text-slate-500 mb-6">
              You are about to unban <span className="font-bold text-slate-700">@{unbanModal.user?.username}</span>. They will regain full access to the platform.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setUnbanModal({ open: false, user: null })}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-colors"
              >
                No, Keep Banned
              </button>
              <button
                disabled={actionLoading === unbanModal.user?.id}
                onClick={handleUnban}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex justify-center items-center"
              >
                {actionLoading === unbanModal.user?.id ? <Loader2 size={18} className="animate-spin" /> : "Yes, Unban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;