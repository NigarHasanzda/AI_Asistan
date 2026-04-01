"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    Loader2,
    Globe,
    Eye,
    ExternalLink,
    MoreHorizontal
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getAdminCompanies, approveCompany, rejectCompany } from "@/services/Admin/Company";

const Page = () => {
    const router = useRouter();
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    
    // Filter States
    const [isApproved, setIsApproved] = useState<string>("all");
    const [isRejected, setIsRejected] = useState<string>("all");
    const [isPremium, setIsPremium] = useState<string>("all");

    // Modal States
    const [rejectReason, setRejectReason] = useState("");
    const [rejectingCompanyId, setRejectingCompanyId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const pageSize = 10;

    const handleReset = () => {
        setSearch("");
        setIsApproved("all");
        setIsRejected("all");
        setIsPremium("all");
        setPage(1);
        toast.success("Filters reset");
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
            toast.error("Error fetching companies");
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

    const handleApprove = async (id: number) => {
        const t = toast.loading("Approving company...");
        try {
            await approveCompany(id);
            toast.success("Company approved! ✅", { id: t });
            fetchCompanies();
        } catch (err) {
            toast.error("Failed to approve", { id: t });
        }
    };

    const handleReject = async () => {
        if (!rejectingCompanyId || !rejectReason.trim()) {
            toast.error("Please provide a reason");
            return;
        }
        const t = toast.loading("Rejecting company...");
        try {
            await rejectCompany(rejectingCompanyId, rejectReason);
            toast.success("Company rejected ❌", { id: t });
            setModalOpen(false);
            setRejectReason("");
            setRejectingCompanyId(null);
            fetchCompanies();
        } catch (err) {
            toast.error("Failed to reject", { id: t });
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6">
            <Toaster position="top-right" />


            <div className="max-w-[90%] mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                            <Building2 size={24} />
                        </div>
                        Company Management
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Review, verify and manage employer accounts</p>
                </div>

                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
                >
                    <RotateCcw size={18} />
                    Reset All
                </button>
            </div>


            <div className="max-w-[90%] mx-auto bg-white p-4 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select 
                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none cursor-pointer focus:border-indigo-500"
                        value={isApproved} 
                        onChange={(e) => setIsApproved(e.target.value)}
                    >
                        <option value="all">Status: All</option>
                        <option value="true">Approved</option>
                        <option value="false">Pending</option>
                    </select>

                    <select 
                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none cursor-pointer focus:border-indigo-500"
                        value={isRejected} 
                        onChange={(e) => setIsRejected(e.target.value)}
                    >
                        <option value="all">Rejection: All</option>
                        <option value="true">Rejected</option>
                        <option value="false">Active</option>
                    </select>

                    <select 
                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none cursor-pointer focus:border-indigo-500"
                        value={isPremium} 
                        onChange={(e) => setIsPremium(e.target.value)}
                    >
                        <option value="all">Tier: All</option>
                        <option value="true">Premium Only ⭐</option>
                        <option value="false">Standard Only</option>
                    </select>
                </div>
            </div>


            <div className="max-w-[90%] mx-auto bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Company Profile</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Contact & Web</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan={4} className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" size={40} /></td></tr>
                            ) : companies.length === 0 ? (
                                <tr><td colSpan={4} className="py-24 text-center font-bold text-slate-400 italic text-lg">No companies found</td></tr>
                            ) : companies.map((company) => (
                                <tr key={company.id} className="hover:bg-indigo-50/30 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img
                                                    src={company.photoUrl || "https://via.placeholder.com/150"}
                                                    className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-white ring-1 ring-slate-100"
                                                    alt="logo"
                                                />
                                                {company.isPremium && (
                                                    <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-1 rounded-lg shadow-lg border-2 border-white">
                                                        <Star size={12} fill="white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{company.companyName}</p>
                                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">@{company.username}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-8 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 italic">
                                                <Mail size={14} className="text-indigo-400" /> {company.email}
                                            </div>
                                            {company.website && (
                                                <a 
                                                    href={company.website} 
                                                    target="_blank" 
                                                    className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors"
                                                >
                                                    <Globe size={12} /> WEBSITE <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-8 py-5 text-center">
                                        {company.isApproved ? (
                                            <span className="px-4 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">Verified</span>
                                        ) : company.isRejected ? (
                                            <span className="px-4 py-1.5 rounded-xl bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest border border-rose-200">Rejected</span>
                                        ) : (
                                            <span className="px-4 py-1.5 rounded-xl bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-200">Pending</span>
                                        )}
                                    </td>

                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => router.push(`/admindashboard/company/${company.id}`)}
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-indigo-600 transition-all shadow-md active:scale-95"
                                            >
                                                <Eye size={14} /> Details
                                            </button>

                                            {!company.isApproved && !company.isRejected && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(company.id)}
                                                        className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setRejectingCompanyId(company.id); setModalOpen(true); }}
                                                        className="p-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODERN PAGINATION */}
            <div className="max-w-7xl mx-auto mt-10 flex flex-col md:flex-row items-center justify-between px-4 gap-4">
                <p className="text-sm font-bold text-slate-400">
                    Showing Page <span className="text-indigo-600 text-lg">{page}</span>
                </p>

                <div className="flex items-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-30 shadow-sm"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="flex gap-2 mx-2">
                        {[page - 1, page, page + 1].filter(p => p > 0).map((num) => (
                            <button
                                key={num}
                                onClick={() => setPage(num)}
                                className={`w-12 h-12 rounded-2xl font-black transition-all ${page === num ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white text-slate-400 hover:text-indigo-600'}`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={companies.length < pageSize}
                        onClick={() => setPage(p => p + 1)}
                        className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-30 shadow-sm"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* REJECT MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 mb-6 text-rose-600">
                            <XCircle size={32} />
                            <h2 className="text-2xl font-black tracking-tight">Reject Company</h2>
                        </div>
                        <p className="text-slate-500 mb-6 font-medium">Please provide a valid reason for rejection. This will be sent to the company.</p>
                        <textarea
                            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl mb-6 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-medium h-32 resize-none"
                            placeholder="Reasoning..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => { setModalOpen(false); setRejectReason(""); }}
                                className="py-4 rounded-2xl bg-slate-100 text-slate-600 font-black hover:bg-slate-200 transition-all"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleReject}
                                className="py-4 rounded-2xl bg-rose-600 text-white font-black hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                            >
                                REJECT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;