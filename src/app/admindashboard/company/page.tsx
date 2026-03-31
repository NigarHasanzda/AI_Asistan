"use client";

import React, { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Search,
    CheckCircle2,
    XCircle,
    Building2,
    Star,
    Mail,
    Loader2
} from "lucide-react";
import { getAdminCompanies, approveCompany, rejectCompany } from "@/services/Admin/Company";

const Page = () => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isApproved, setIsApproved] = useState<string>("all");
    const [isRejected, setIsRejected] = useState<string>("all");
    const [isPremium, setIsPremium] = useState<string>("all");

    const [rejectReason, setRejectReason] = useState("");
    const [rejectingCompanyId, setRejectingCompanyId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    console.log(companies);
    

    const pageSize = 10;

    const handleReset = () => {
        setSearch("");
        setIsApproved("all");
        setIsRejected("all");
        setIsPremium("all");
        setPage(1);
    };

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const res = await getAdminCompanies({
                keyword: search || undefined,
                isApproved: isApproved === "all" ? undefined : isApproved === "true",
                isRejected: isRejected === "all" ? undefined : isRejected === "true",
                isPremium: isPremium === "all" ? undefined : isPremium === "true",
                page,
                pageSize,
            });
            setCompanies(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [page, isApproved, isRejected, isPremium]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setPage(1);
            fetchCompanies();
        }, 500);
        return () => clearTimeout(delay);
    }, [search]);

    // Approve funksiyası
    const handleApprove = async (id: number) => {
        try {
            await approveCompany(id);
            fetchCompanies();
        } catch (err) {
            console.error(err);
        }
    };

    // Reject funksiyası
    const handleReject = async () => {
        if (rejectingCompanyId === null) {
            alert("No company selected for rejection");
            return;
        }
        if (!rejectReason.trim()) {
            alert("Please enter a reason for rejection");
            return;
        }
        try {
            await rejectCompany(rejectingCompanyId, rejectReason);
            setModalOpen(false);
            setRejectReason("");
            setRejectingCompanyId(null);
            fetchCompanies();
        } catch (err: any) {
            console.error("Reject company error:", err);
            alert(err.response?.data?.message || "Failed to reject company");
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 md:p-10 text-slate-900 font-sans">
            {/* HEADER */}
            <div className="max-w-[97%] mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-600 rounded-xl text-white">
                            <Building2 size={24} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">Companies</h1>
                    </div>
                    <p className="text-slate-500 font-medium tracking-wide">Manage and monitor company registrations and tiers</p>
                </div>

                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                >
                    <RotateCcw size={18} className="text-indigo-500" />
                    Reset Filters
                </button>
            </div>

            {/* FILTERS */}
            <div className="max-w-[97%] mx-auto space-y-6">
                <div className="bg-white p-5 rounded-[24px] border border-slate-200/60 shadow-xl shadow-slate-200/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 rounded-2xl transition-all font-medium outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 outline-none cursor-pointer appearance-none border-r-8 border-r-transparent"
                            value={isApproved}
                            onChange={(e) => setIsApproved(e.target.value)}
                        >
                            <option value="all">All Approval States</option>
                            <option value="true">Approved Only</option>
                            <option value="false">Pending Approval</option>
                        </select>

                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 outline-none cursor-pointer appearance-none border-r-8 border-r-transparent"
                            value={isRejected}
                            onChange={(e) => setIsRejected(e.target.value)}
                        >
                            <option value="all">All Rejection States</option>
                            <option value="true">Rejected</option>
                            <option value="false">Active (Not Rejected)</option>
                        </select>

                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 outline-none cursor-pointer appearance-none border-r-8 border-r-transparent"
                            value={isPremium}
                            onChange={(e) => setIsPremium(e.target.value)}
                        >
                            <option value="all">All Tiers</option>
                            <option value="true">⭐ Premium Tiers</option>
                            <option value="false">Standard Tiers</option>
                        </select>
                    </div>
                </div>

                {/* TABLE */}
                <div className="max-w-[100%] mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Profile & Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Contact Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Tier</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" /></td></tr>
                            ) : companies.map((company) => (
                                <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={company.photoUrl || "https://via.placeholder.com/150"}
                                                alt={company.companyName}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-100"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{company.companyName}</span>
                                                <span className="text-xs text-slate-400">@{company.username}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                            <Mail size={14} className="text-slate-400" />
                                            {company.email}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        {company.isApproved ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase border border-emerald-100">
                                                <CheckCircle2 size={12} /> Approved
                                            </span>
                                        ) : company.isRejected ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase border border-red-100">
                                                <XCircle size={12} /> Rejected
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase border border-amber-100">
                                                <XCircle size={12} /> Pending
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        {company.isPremium ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase shadow-sm shadow-indigo-200">
                                                <Star size={12} fill="white" /> Premium
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs font-bold">Standard</span>
                                        )}
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                        {!company.isApproved && !company.isRejected && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(company.id)}
                                                    className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-all"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => { setRejectingCompanyId(company.id); setModalOpen(true); }}
                                                    className="px-3 py-1 rounded-lg bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="mt-8 flex justify-center items-center gap-3">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-2">
                        {[1, 2, 3].map((num) => (
                            <button
                                key={num}
                                onClick={() => setPage(num)}
                                className={`w-10 h-10 rounded-xl font-bold transition-all ${page === num ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500'}`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={companies.length < pageSize}
                        onClick={() => setPage(p => p + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* REJECT MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-[400px] max-w-[90%]">
                        <h2 className="text-xl font-bold mb-4">Reject Company</h2>
                        <textarea
                            className="w-full p-3 border border-slate-300 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;