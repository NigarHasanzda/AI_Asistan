"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Users, Pencil, Plus, X, Lock, Unlock, CheckCircle2, 
  BarChart3, Search, Trash2, RotateCcw, ChevronDown,
  LayoutGrid, ListFilter, Calendar, MapPin, DollarSign,
  ArrowUpRight, Sparkles, MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import {
  getCompanyInternships,
  addSkillToInternship,
  deleteInternship,
  getInternshipById,
  updateInternship,
  closeInternship,
  reopenInternship
} from "@/services/InternshipServices";

// --- Interfaces ---
interface Internship {
  id: number;
  title: string;
  description?: string;
  isPaid?: boolean;
  locationType?: number;
  startDate?: string;
  endDate?: string;
  deadlineDate?: string;
  departmentId?: number;
  skillIds?: number[];
  applicationCount?: number;
  skills: string[];
  status?: string;
}

const InternshipCard = ({
  id, title, applicationCount = 0, status, onAddSkill, onDeleteRequest, onView, onToggleStatus 
}: any) => {
  const [newSkill, setNewSkill] = useState("");
  const isClosed = status === "Closed" || status === "Inactive";
  const router = useRouter();

  const handleAddSkill = () => {
    if (!newSkill.trim() || isClosed) return;
    onAddSkill(id, newSkill.trim());
    setNewSkill("");
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative flex flex-col  rounded-[32px] p-1 border transition-all duration-500 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] ${
        isClosed ? "grayscale-[0.5] opacity-80 border-slate-100" : "border-transparent hover:border-indigo-100"
      }`}
    >
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-6">
          <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${
            isClosed ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isClosed ? "bg-slate-400" : "bg-emerald-500 animate-pulse"}`} />
            {isClosed ? "Archived" : "Live Now"}
          </div>
          
          <div className="flex gap-1">
            <button onClick={() => onToggleStatus(id, status)} className="p-2.5 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
              {isClosed ? <Unlock size={18} /> : <Lock size={18} />}
            </button>
            <button onClick={() => onDeleteRequest(id)} className="p-2.5 rounded-2xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <h3 className={`text-xl font-bold tracking-tight leading-snug ${isClosed ? "text-slate-500" : "text-slate-900"}`}>
            {title}
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-wider">
              <Users size={14} className="text-indigo-500" />
              {applicationCount} Applicants
            </div>
            <div className="h-1 w-1 bg-slate-300 rounded-full" />
            <div className="text-indigo-600 font-bold text-xs uppercase tracking-wider cursor-pointer hover:underline flex items-center gap-1" onClick={() => router.push(`/dashboard/analytics/${id}`)}>
              Insights <ArrowUpRight size={14} />
            </div>
          </div>
        </div>

        {/* Applicant Progress Mini Bar */}
        <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden mb-6">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((applicationCount / 20) * 100, 100)}%` }}
            className={`h-full rounded-full ${isClosed ? "bg-slate-300" : "bg-indigo-600"}`}
          />
        </div>
      </div>

      <div className="mt-auto px-4 pb-4">
        {!isClosed && (
          <div className="relative mb-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Tag new skill..."
              className="w-full bg-slate-50/50 border border-slate-100 rounded-[20px] pl-4 pr-12 py-3 text-xs font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none"
            />
            <button onClick={handleAddSkill} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-xl hover:scale-105 transition-transform">
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/dashboard/listings/${id}`)}
            className="flex-1 py-4 bg-slate-900 text-white rounded-[22px] text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-100"
          >
            Manage Candidates
          </button>
          <button 
            onClick={() => onView(id)} 
            className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-[22px] transition-all"
          >
            <Pencil size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Page = () => {
  const [postings, setPostings] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const router = useRouter();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getCompanyInternships();
      setPostings(data.sort((a: any, b: any) => (a.status === "Closed" ? 1 : -1)));
    } catch (error) { toast.error("Data load failed"); } finally { setLoading(false); }
  };

  const filteredPostings = useMemo(() => {
    return postings.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const isClosed = item.status === "Closed" || item.status === "Inactive";
      const matchesStatus = statusFilter === "all" ? true : statusFilter === "active" ? !isClosed : isClosed;
      const matchesPayment = paymentFilter === "all" ? true : paymentFilter === "paid" ? item.isPaid : !item.isPaid;
      const matchesLocation = locationFilter === "all" ? true : item.locationType === Number(locationFilter);
      return matchesSearch && matchesStatus && matchesPayment && matchesLocation;
    });
  }, [postings, searchQuery, statusFilter, paymentFilter, locationFilter]);

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const isClosed = currentStatus === "Closed" || currentStatus === "Inactive";
    const promise = isClosed ? reopenInternship(id) : closeInternship(id);
    await toast.promise(promise, { loading: 'Updating...', success: 'Status updated!', error: 'Error' });
    fetchData();
    setSelectedInternship(null);
  };

  const handleUpdate = async () => {
    if (!selectedInternship) return;
    const promise = updateInternship(selectedInternship.id, selectedInternship);
    await toast.promise(promise, { loading: 'Saving...', success: 'Success!', error: 'Error' });
    setSelectedInternship(null);
    fetchData();
  };

  return (
    <div className="min-h-screen  selection:bg-indigo-100 selection:text-indigo-700">
      <Toaster position="bottom-center" />
      
      {/* Header Section */}
      <div className=" border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                <Sparkles size={14} className="fill-indigo-600" />
                Recruitment Dashboard
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Active Listings</h1>
              <p className="text-slate-400 font-medium text-lg">You have {postings.length} total internship postings.</p>
            </div>
            
            <button onClick={() => router.push("/dashboard/post")} className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-[24px] font-black text-sm uppercase tracking-wider hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95">
              <Plus size={20} strokeWidth={3} /> Post New Role
            </button>
          </div>

          {/* Sub-Header: Filters & Search */}
          <div className="mt-12 flex flex-col lg:flex-row gap-4">
            <div className="relative flex-[2]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                placeholder="Search by title, role or department..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[28px] outline-none text-slate-700 font-bold placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all"
              />
            </div>
            
            <div className="flex flex-1 items-center gap-3">
              <div className="flex-1 relative group">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 py-5 px-8 rounded-[28px] text-xs font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer hover:border-indigo-200 transition-all shadow-sm"
                >
                  <option value="all">Status: All</option>
                  <option value="active">Status: Active</option>
                  <option value="closed">Status: Closed</option>
                </select>
                <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {(searchQuery || statusFilter !== "all") && (
                <button onClick={() => { setSearchQuery(""); setStatusFilter("all"); }} className="p-5 bg-indigo-50 text-indigo-600 rounded-[28px] hover:bg-indigo-100 transition-all">
                  <RotateCcw size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-10 h-10 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Database</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPostings.length > 0 ? (
              filteredPostings.map(item => (
                <InternshipCard 
                  key={item.id} {...item} 
                  onDeleteRequest={setDeleteTargetId}
                  onAddSkill={async (id: number, s: string) => { await addSkillToInternship(id, s); fetchData(); }}
                  onView={async (id: number) => { const d = await getInternshipById(id); setSelectedInternship({ ...d, id }); }}
                  onToggleStatus={handleStatusToggle}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200">
                <Search size={48} className="text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No postings match your search</h3>
                <p className="text-slate-400 mt-1 mb-6">Try refining your filters or create a new listing.</p>
                <button onClick={() => { setSearchQuery(""); setStatusFilter("all"); }} className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Clear all filters</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals - Edit & Delete (Simplified for brevity but kept functional) */}
      <AnimatePresence>
        {selectedInternship && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[48px] p-10 w-full max-w-2xl shadow-2xl relative"
            >
              <button onClick={() => setSelectedInternship(null)} className="absolute top-8 right-8 p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                <X size={20} />
              </button>
              
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Modify Placement</h2>
                <p className="text-slate-400 font-medium">Update the core details of this internship role.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Position Title</label>
                    <input 
                      value={selectedInternship.title} 
                      onChange={(e) => setSelectedInternship({...selectedInternship, title: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] px-6 py-4 focus:bg-white focus:border-indigo-100 transition-all font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deadline Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                      <input 
                        type="date" 
                        value={selectedInternship.deadlineDate?.split('T')[0]} 
                        onChange={(e) => setSelectedInternship({...selectedInternship, deadlineDate: e.target.value})} 
                        className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] pl-14 pr-6 py-4 focus:bg-white focus:border-indigo-100 transition-all font-bold text-slate-600" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role Mission Statement</label>
                  <textarea 
                    value={selectedInternship.description} 
                    onChange={(e) => setSelectedInternship({...selectedInternship, description: e.target.value})} 
                    rows={4} 
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] px-6 py-4 focus:bg-white focus:border-indigo-100 transition-all font-medium text-slate-600 resize-none" 
                  />
                </div>

                <div className="flex items-center gap-6 p-6 bg-indigo-50/50 rounded-[30px] border-2 border-white shadow-sm">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedInternship.isPaid ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                    <DollarSign size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900">Financial Compensation</p>
                    <p className="text-xs font-medium text-slate-400">Is this a paid internship position?</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={selectedInternship.isPaid} onChange={(e) => setSelectedInternship({...selectedInternship, isPaid: e.target.checked})} className="sr-only peer"/>
                    <div className="w-14 h-8 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6 shadow-sm"></div>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setSelectedInternship(null)} className="flex-1 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all">Cancel</button>
                <button onClick={handleUpdate} className="flex-[2] py-5 bg-indigo-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-slate-900 shadow-xl shadow-indigo-100 transition-all">Apply Changes</button>
              </div>
            </motion.div>
          </div>
        )}

        {deleteTargetId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[40px] p-10 w-full max-w-sm text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Trash2 size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Are you sure?</h2>
              <p className="text-slate-400 font-medium mb-8">This will permanently delete the listing and all applicant data.</p>
              <div className="flex flex-col gap-3">
                <button onClick={async () => { await deleteInternship(deleteTargetId); fetchData(); setDeleteTargetId(null); }} className="w-full py-4 bg-rose-500 text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all">Delete Forever</button>
                <button onClick={() => setDeleteTargetId(null)} className="w-full py-4 bg-slate-50 text-slate-500 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Keep Listing</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;