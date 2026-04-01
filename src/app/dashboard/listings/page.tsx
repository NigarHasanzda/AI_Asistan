"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Users, Pencil, Plus, X, Lock, Unlock, CheckCircle2, BarChart3, Search, Trash2, AlertCircle, RotateCcw, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

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

interface InternshipCardProps extends Internship {
  onAddSkill: (id: number, skill: string) => void;
  onDeleteRequest: (id: number) => void;
  onView: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: string) => void;
}

// --- Card Component ---
const InternshipCard = ({
  id,
  title,
  applicationCount,
  status,
  onAddSkill,
  onDeleteRequest,
  onView,
  onToggleStatus
}: InternshipCardProps) => {
  const [newSkill, setNewSkill] = useState("");
  const isClosed = status === "Closed" || status === "Inactive";
  const router = useRouter();

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
        toast.error("Bacarıq adı boş ola bilməz");
        return;
    }
    if (isClosed) {
        toast.error("Bağlı elana bacarıq əlavə etmək olmaz");
        return;
    }
    onAddSkill(id, newSkill.trim());
    setNewSkill("");
  };

  return (
    <div className={`group relative flex flex-col h-full border-2 transition-all duration-500 rounded-[28px] p-6 ${
      isClosed 
        ? "bg-slate-50/50 border-dashed border-slate-200 opacity-75" 
        : "bg-white border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1"
    }`}>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          {isClosed ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
              <Lock size={13} strokeWidth={2.5} /> Closed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[11px] font-bold uppercase tracking-wider animate-pulse-subtle">
              <CheckCircle2 size={13} strokeWidth={2.5} /> Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link 
            href={`/dashboard/analytics/${id}`}
            className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
            title="Analytics"
          >
            <BarChart3 size={18} />
          </Link>
          <button
            onClick={() => onToggleStatus(id, status || "Active")}
            className={`p-2 rounded-xl transition-all ${
              isClosed ? "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {isClosed ? <Unlock size={18} /> : <Lock size={18} />}
          </button>
          <button
            onClick={() => onDeleteRequest(id)}
            className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h3 className={`text-xl font-extrabold mb-2 leading-tight tracking-tight transition-colors ${
          isClosed ? "text-slate-400" : "text-slate-900"
        }`}>
          {title}
        </h3>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-indigo-700 mb-6">
          <Users size={16} strokeWidth={2.5} />
          <span className="text-sm font-bold">{applicationCount} Applicants</span>
        </div>
      </div>

      {!isClosed && (
        <div className="relative flex items-center mb-6 group/input">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Quick add skill..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400"
          />
          <button 
            onClick={handleAddSkill} 
            className="absolute right-2 p-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 mt-auto">
        <button
          onClick={() => router.push(`/dashboard/listings/${id}`)}
          className={`flex-[3] py-3.5 rounded-2xl text-[14px] font-bold tracking-wide transition-all ${
            isClosed 
            ? "bg-slate-200 text-slate-500 hover:bg-slate-300" 
            : "bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-100 hover:shadow-indigo-200"
          }`}
        >
          View Details
        </button>
        <button 
          onClick={() => onView(id)} 
          className="flex-1 flex justify-center py-3.5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 rounded-2xl transition-all"
        >
          <Pencil size={20} />
        </button>
      </div>
    </div>
  );
};

// --- Main Page ---
const Page = () => {
  const [postings, setPostings] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  
  // Filter states
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
      const formatted = data.map((item: any) => ({
        ...item,
        skills: item.skills || [],
        applicants: item.applicantsCount || 0,
        status: item.status || "Active"
      })).sort((a: any, b: any) => (a.status === "Closed" ? 1 : -1));
      setPostings(formatted);
    } catch (error) { 
      toast.error("Məlumatları yükləmək mümkün olmadı");
    } finally { 
      setLoading(false); 
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setLocationFilter("all");
    toast.success("Filtrlər sıfırlandı", { icon: '🔄', duration: 1500 });
  };

  const isAnyFilterActive = searchQuery !== "" || statusFilter !== "all" || paymentFilter !== "all" || locationFilter !== "all";

  const filteredPostings = useMemo(() => {
    return postings.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const isClosed = item.status === "Closed" || item.status === "Inactive";
      const matchesStatus = statusFilter === "all" ? true : statusFilter === "active" ? !isClosed : isClosed;
      const matchesPayment = paymentFilter === "all" ? true : paymentFilter === "paid" ? item.isPaid === true : item.isPaid === false;
      const matchesLocation = locationFilter === "all" ? true : item.locationType === Number(locationFilter);
      return matchesSearch && matchesStatus && matchesPayment && matchesLocation;
    });
  }, [postings, searchQuery, statusFilter, paymentFilter, locationFilter]);

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const isClosed = currentStatus === "Closed" || currentStatus === "Inactive";
    const promise = isClosed ? reopenInternship(id) : closeInternship(id);
    toast.promise(promise, { loading: 'Status yenilənir...', success: isClosed ? 'Elan yenidən aktiv edildi!' : 'Elan uğurla bağlandı!', error: (err) => err.response?.data?.message || 'Xəta baş verdi' });
    try { await promise; fetchData(); setSelectedInternship(null); } catch (e) {}
  };

  const handleUpdate = async () => {
    if (!selectedInternship?.id) return;
    const updateData = {
      title: selectedInternship.title?.trim() || "",
      description: selectedInternship.description?.trim() || "",
      isPaid: selectedInternship.isPaid ?? true,
      locationType: Number(selectedInternship.locationType) || 0,
      startDate: selectedInternship.startDate || new Date().toISOString(),
      endDate: selectedInternship.endDate || new Date().toISOString(),
      deadlineDate: selectedInternship.deadlineDate || new Date().toISOString(),
      departmentId: Number(selectedInternship.departmentId) || 1,
      skillIds: selectedInternship.skillIds?.length ? selectedInternship.skillIds.map(Number) : [],
    };
    const promise = updateInternship(selectedInternship.id, updateData);
    toast.promise(promise, { loading: 'Yenilənir...', success: 'Uğurla yeniləndi!', error: (err) => err.response?.data?.message || 'Xəta' });
    try { await promise; setSelectedInternship(null); fetchData(); } catch (e) {}
  };

  const handleAddSkillAction = async (id: number, skill: string) => {
    const promise = addSkillToInternship(id, skill);
    toast.promise(promise, {
      loading: 'Bacarıq əlavə edilir...',
      success: `'${skill}' uğurla əlavə edildi!`,
      error: 'Bacarıq əlavə olunarkən xəta baş verdi'
    });
    try { await promise; fetchData(); } catch (e) {}
  }

  const handleViewAction = async (id: number) => {
    try {
        const data = await getInternshipById(id);
        setSelectedInternship({ ...data, id, skills: data.skills || [] });
        toast.success("Redaktə paneli açıldı", { duration: 1000, icon: '📝' });
    } catch (e) {
        toast.error("Məlumat gətirilərkən xəta baş verdi");
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF] p-6 md:p-12 font-sans text-slate-900">
      <Toaster position="top-right" />
      
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-[40px] font-black text-slate-900 tracking-tight leading-none">Internships</h1>
            <p className="text-slate-500 mt-3 text-lg font-medium">Manage and monitor your internship listings.</p>
          </div>
          <Link href="/dashboard/post" onClick={() => toast.loading("Yeni elan səhifəsinə keçilir...", { duration: 1000 })} className="flex items-center gap-2 bg-indigo-600 text-white px-7 py-4 rounded-[22px] font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 w-fit">
            <Plus size={20} strokeWidth={3} /> Create New
          </Link>
        </header>

        {/* Filters Section */}
        <div className="mb-10 bg-white p-2 rounded-[35px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col lg:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-transparent rounded-[30px] outline-none text-slate-700 font-medium placeholder:text-slate-400 focus:bg-slate-50/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 p-2 w-full lg:w-auto">
            {/* Custom Select Wrapper */}
            {[
              { label: 'Status', val: statusFilter, set: setStatusFilter, opt: [{l:'All Status',v:'all'}, {l:'Active',v:'active'}, {l:'Closed',v:'closed'}] },
              { label: 'Ödəniş', val: paymentFilter, set: setPaymentFilter, opt: [{l:'All Payment',v:'all'}, {l:'Paid',v:'paid'}, {l:'Unpaid',v:'unpaid'}] },
              { label: 'Məkan', val: locationFilter, set: setLocationFilter, opt: [{l:'All Location',v:'all'}, {l:'On-site',v:'0'}, {l:'Remote',v:'1'}, {l:'Hybrid',v:'2'}] }
            ].map((f, i) => (
              <div key={i} className="relative group flex-1 lg:flex-none min-w-[140px]">
                <select 
                  value={f.val} 
                  onChange={(e) => {
                    f.set(e.target.value);
                    toast.success(`${f.label} filtri yeniləndi`, { duration: 800 });
                  }}
                  className="w-full appearance-none bg-slate-50 border border-slate-100 py-3.5 px-5 pr-10 rounded-2xl text-sm font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-100 hover:border-slate-200 transition-all focus:ring-2 focus:ring-indigo-100"
                >
                  {f.opt.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
              </div>
            ))}

            {/* Reset Button */}
            {isAnyFilterActive && (
              <button 
                onClick={resetFilters}
                className="flex items-center gap-2 px-5 py-3.5 bg-orange-50 text-orange-600 rounded-2xl font-bold text-sm hover:bg-orange-100 transition-all animate-in fade-in zoom-in duration-300"
              >
                <RotateCcw size={16} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
             <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
             <p className="text-slate-400 font-bold tracking-wide">Fetching data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPostings.length > 0 ? (
              filteredPostings.map(item => (
                <InternshipCard 
                  key={item.id} {...item} 
                  onDeleteRequest={(id) => {
                    setDeleteTargetId(id);
                    toast("Silmək üçün təsdiq gözlənilir", { icon: '⚠️' });
                  }} 
                  onAddSkill={handleAddSkillAction} 
                  onView={handleViewAction}
                  onToggleStatus={handleStatusToggle}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-white rounded-[50px] border-2 border-dashed border-slate-100 shadow-inner">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No matches found</h3>
                <p className="text-slate-400 mt-2 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                <button onClick={resetFilters} className="mt-6 text-indigo-600 font-bold hover:underline">Clear all filters</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-[35px] p-10 w-full max-w-md shadow-2xl scale-in-center">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500 rotate-12 group-hover:rotate-0 transition-transform">
              <Trash2 size={36} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3 text-center">Delete Listing?</h2>
            <p className="text-slate-500 mb-10 text-center leading-relaxed font-medium">This action is permanent. All associated applicant data will be removed from the system.</p>
            <div className="flex gap-4">
              <button onClick={() => {
                setDeleteTargetId(null);
                toast.dismiss();
              }} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={async () => { 
                const promise = deleteInternship(deleteTargetId);
                toast.promise(promise, { loading: 'Silinir...', success: 'Uğurla silindi!', error: 'Silinmə zamanı xəta' });
                await promise; 
                fetchData(); 
                setDeleteTargetId(null); 
              }} className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-100">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {selectedInternship && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[45px] p-12 w-full max-w-2xl shadow-2xl relative my-auto">
             <button onClick={() => {
                setSelectedInternship(null);
                toast.success("Dəyişikliklər ləğv edildi", { icon: '🚫' });
             }} className="absolute top-10 right-10 p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"><X size={24} /></button>
             <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">Edit Posting</h2>
             
             <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Internship Title</label>
                  <input value={selectedInternship.title} onChange={(e) => setSelectedInternship({...selectedInternship, title: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-[22px] px-6 py-5 outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold text-slate-700" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Detailed Description</label>
                  <textarea value={selectedInternship.description} onChange={(e) => setSelectedInternship({...selectedInternship, description: e.target.value})} rows={4} className="w-full bg-slate-50 border-2 border-transparent rounded-[22px] px-6 py-5 outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all font-medium text-slate-600" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Application Deadline</label>
                    <input type="date" value={selectedInternship.deadlineDate?.split('T')[0]} onChange={(e) => {
                        setSelectedInternship({...selectedInternship, deadlineDate: e.target.value});
                        toast("Tarix dəyişdirildi", { duration: 1000, icon: '📅' });
                    }} className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] px-6 py-4 outline-none font-bold text-slate-600" />
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-indigo-50/30 rounded-[20px] border-2 border-indigo-50/50 mt-4">
                    <input type="checkbox" checked={selectedInternship.isPaid} onChange={(e) => {
                        setSelectedInternship({...selectedInternship, isPaid: e.target.checked});
                        toast.success(e.target.checked ? "Ödənişli təcrübə" : "Ödənişsiz təcrübə");
                    }} className="w-6 h-6 accent-indigo-600 rounded-lg" />
                    <label className="text-sm font-black text-indigo-900">Paid Internship</label>
                  </div>
                </div>
             </div>

             <div className="flex gap-4 mt-12">
               <button onClick={() => handleStatusToggle(selectedInternship.id, selectedInternship.status || "Active")} className={`flex-1 py-5 rounded-[22px] font-black border-2 transition-all ${selectedInternship.status === "Closed" ? "border-blue-100 text-blue-600 bg-blue-50/50 hover:bg-blue-100" : "border-orange-100 text-orange-600 bg-orange-50/50 hover:bg-orange-100"}`}>
                 {selectedInternship.status === "Closed" ? "Re-activate" : "Close Posting"}
               </button>
               <button onClick={handleUpdate} className="flex-[1.5] bg-indigo-600 text-white py-5 rounded-[22px] font-black hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all">Save All Changes</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;