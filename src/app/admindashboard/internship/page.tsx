"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  Briefcase, 
  Building2, 
  Calendar, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  DollarSign,
  Users,
  Trash2,
  Search,
  Plus,
  AlertTriangle,
  Eye
} from "lucide-react";
import { getAdminInternships, deleteAdminInternship } from "@/services/Admin/Internship";

const InternshipsListPage = () => {
  const router = useRouter();
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null,
  });
  const pageSize = 10;

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const data = await getAdminInternships({ page, pageSize });
      setInternships(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [page]);

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteAdminInternship(deleteModal.id);
      setDeleteModal({ isOpen: false, id: null });
      fetchInternships();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-10 bg-[#F8FAFC]">
      {/* Header Section */}
      <div className="max-w-[90%] mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Internship Management</h1>
          <p className="text-slate-500 font-medium mt-1">Review, track, and manage all active internship opportunities.</p>
        </div>
        <button 
          onClick={() => router.push('/admindashboard/internship/create')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} /> Post New Position
        </button>
      </div>

      {/* Main Content Card */}
      <div className="max-w-[90%] mx-auto bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-indigo-50 border-t-indigo-600 animate-spin"></div>
            </div>
            <p className="text-slate-400 font-bold mt-4 tracking-widest uppercase text-xs">Syncing Data...</p>
          </div>
        ) : internships.length === 0 ? (
          <div className="py-40 text-center">
             <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase size={32} className="text-slate-300" />
             </div>
             <h3 className="text-lg font-bold text-slate-800">No Internships Found</h3>
             <p className="text-slate-500">Try adjusting your filters or post a new one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                  <th className="px-8 py-5">Role & Company</th>
                  <th className="px-6 py-5">Department</th>
                  <th className="px-6 py-5 text-center">Applicants</th>
                  <th className="px-6 py-5">Type</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right whitespace-nowrap">Deadline</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {internships.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">{item.title}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building2 size={12} /> {item.companyName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                       <span className="text-sm font-semibold text-slate-600 px-3 py-1 bg-slate-100 rounded-lg">{item.departmentName}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-2 text-sm font-black text-slate-800">
                        <Users size={16} className="text-indigo-400" /> {item.applicationCount}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {item.isPaid ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                           Paid
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-500">
                           Volunteer
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {item.status === "Open" ? (
                        <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Live
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs font-black text-rose-500 uppercase">
                          <XCircle size={14} /> Ended
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                       <div className="text-sm font-bold text-slate-700 flex items-center justify-end gap-2">
                         <Calendar size={14} className="text-slate-400" />
                         {formatDate(item.deadlineDate)}
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => router.push(`/admindashboard/internship/${item.id}`)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, id: item.id })}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Listing"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer / Pagination */}
        <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 font-medium">
            Page <span className="text-slate-900 font-bold">{page}</span> of 12
          </p>
          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex gap-1">
                {[1, 2, 3].map(n => (
                    <button key={n} onClick={() => setPage(n)} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === n ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}>
                        {n}
                    </button>
                ))}
            </div>
            <button
              disabled={internships.length < pageSize}
              onClick={() => setPage((p) => p + 1)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Delete Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal({ isOpen: false, id: null })}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-black text-center text-slate-900">Delete Position?</h2>
              <p className="text-slate-500 text-center mt-3 leading-relaxed">
                This action is permanent. All associated applicant data and analytics will be removed from the dashboard.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button 
                  onClick={() => setDeleteModal({ isOpen: false, id: null })}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-6 py-3 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InternshipsListPage;