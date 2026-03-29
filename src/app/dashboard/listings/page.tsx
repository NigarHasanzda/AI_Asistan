"use client";

import React, { useEffect, useState } from "react";
import { Users, Pencil, Plus, X, Lock, Unlock, CheckCircle2, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  applicants?: number;
  skills: string[];
  status?: string;
}

interface InternshipCardProps extends Internship {
  onAddSkill: (id: number, skill: string) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: string) => void;
}

// --- InternshipCard Komponenti ---
const InternshipCard = ({
  id,
  title,
  applicants = 0,
  skills,
  status,
  onAddSkill,
  onDelete,
  onView,
  onToggleStatus
}: InternshipCardProps) => {
  const [newSkill, setNewSkill] = useState("");
  const isClosed = status === "Closed" || status === "Inactive";
  const router = useRouter();

  const handleAddSkill = () => {
    if (!newSkill.trim() || isClosed) return;
    onAddSkill(id, newSkill.trim());
    setNewSkill("");
  };

  const handleView = () => {
    router.push(`/dashboard/listings/${id}`);
  };

  return (
    <div className={`relative border rounded-[32px] p-6 transition-all duration-300 ${
      isClosed ? "bg-gray-50 border-gray-200 opacity-80 grayscale-[0.2]" : "bg-white border-gray-100 shadow-sm hover:shadow-md"
    }`}>
      
      {/* Status Badge */}
      <div className="absolute top-5 left-6">
        {isClosed ? (
          <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5">
            <Lock size={12} /> Closed
          </span>
        ) : (
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5">
            <CheckCircle2 size={12} /> Active
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-5 right-6 flex gap-2">
        <Link 
          href={`/dashboard/analytics/${id}`}
          className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          title="View Analytics"
        >
          <BarChart3 size={18} />
        </Link>

        <button
          onClick={() => onToggleStatus(id, status || "Active")}
          className={`p-2.5 rounded-full transition-colors ${
            isClosed ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "bg-orange-50 text-orange-500 hover:bg-orange-100"
          }`}
          title={isClosed ? "Reopen Listing" : "Close Listing"}
        >
          {isClosed ? <Unlock size={18} /> : <Lock size={18} />}
        </button>

        <button
          onClick={() => confirm("Bu elanı silmək istədiyinizə əminsiniz?") && onDelete(id)}
          className="bg-red-50 text-red-500 p-2.5 rounded-full hover:bg-red-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-10">
        <h3 className={`text-[20px] font-bold mb-1 pr-16 leading-tight ${isClosed ? "text-gray-500" : "text-gray-900"}`}>{title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-1 italic">
          {skills.length ? skills.join(" • ") : "No skills added yet"}
        </p>
      </div>

      <div className="flex items-center gap-2 text-gray-500 text-sm mb-6 bg-gray-50 w-fit px-3 py-1 rounded-lg">
        <Users size={16} />
        <span className="font-medium">{applicants} Applicants</span>
      </div>

      {!isClosed && (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Quick add skill..."
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
          />
          <button onClick={handleAddSkill} className="bg-[#7C3AED] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#5b1dbf] transition-colors">
            Add
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleView}
          className="flex-1 py-3 border rounded-2xl text-sm font-bold transition-all"
        >
          View Details
        </button>
        {!isClosed && (
          <button onClick={() => onView(id)} className="p-3 text-gray-400 hover:bg-gray-100 rounded-xl transition-all border border-transparent hover:border-gray-200">
            <Pencil size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

// --- ManageList Əsas Komponenti ---
const page = () => {
  const [postings, setPostings] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
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
      console.error("Fetch error:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const isClosed = currentStatus === "Closed" || currentStatus === "Inactive";
    try {
      if (isClosed) {
        await reopenInternship(id);
        alert("Elan yenidən aktiv edildi!");
      } else {
        await closeInternship(id);
        alert("Elan uğurla bağlandı!");
      }
      fetchData();
      setSelectedInternship(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Xəta baş verdi");
    }
  };

  const handleView = async (id: number) => {
    try {
      const internship = await getInternshipById(id);
      setSelectedInternship({ ...internship, id, skills: internship.skills || [] });
    } catch (error) { console.error("View error:", error); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSelectedInternship(prev => prev ? { ...prev, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value } : null);
  };

  const handleUpdate = async () => {
    if (!selectedInternship?.id) return;

    try {
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

      await updateInternship(selectedInternship.id, updateData);
      alert("Məlumatlar uğurla yeniləndi!");
      setSelectedInternship(null);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Yeniləmə uğursuz oldu");
      console.error("Update error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] p-6 md:p-12 font-sans">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[36px] font-extrabold text-gray-900 tracking-tight">Postings Management</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage your active and archived internship listings.</p>
          </div>
          <Link href="/dashboard/post" className="flex items-center gap-2 bg-[#7C3AED] text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-[#5b1dbf] transition-all shadow-lg shadow-purple-100 w-fit">
            <Plus size={20} /> Create New Internship
          </Link>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400 gap-3">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7C3AED]"></div>
             <p className="font-medium">Loading your postings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postings.map(item => (
              <InternshipCard 
                key={item.id} {...item} 
                onDelete={async (id) => { await deleteInternship(id); fetchData(); }} 
                onAddSkill={async (id, s) => { await addSkillToInternship(id, s); fetchData(); }} 
                onView={handleView}
                onToggleStatus={handleStatusToggle}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- Detailed Edit Modal --- */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl relative my-auto">
            <button onClick={() => setSelectedInternship(null)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-400" /></button>
            
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Internship Settings</h2>
                <p className="text-gray-500 text-sm">ID: #{selectedInternship.id} • Status: {selectedInternship.status}</p>
              </div>
              <button 
                onClick={() => router.push(`/dashboard/analytics/${selectedInternship.id}`)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
              >
                <BarChart3 size={16} /> View Analytics
              </button>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Title</label>
                <input name="title" value={selectedInternship.title} onChange={handleInputChange} className="w-full border-gray-200 border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#7C3AED]" />
              </div>
              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Description</label>
                <textarea name="description" value={selectedInternship.description} onChange={handleInputChange} rows={3} className="w-full border-gray-200 border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#7C3AED]" />
              </div>
              {/* Deadline */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Deadline</label>
                <input type="date" name="deadlineDate" value={selectedInternship.deadlineDate?.split('T')[0]} onChange={handleInputChange} className="w-full border-gray-200 border rounded-2xl px-5 py-4" />
              </div>
              {/* Paid Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <input type="checkbox" name="isPaid" checked={selectedInternship.isPaid} onChange={handleInputChange} className="w-5 h-5 accent-[#7C3AED]" />
                <label className="text-sm font-bold text-gray-700">Paid</label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => handleStatusToggle(selectedInternship.id, selectedInternship.status || "Active")}
                className={`flex-1 py-4 rounded-2xl font-bold border-2 flex items-center justify-center gap-2 transition-all ${
                  selectedInternship.status === "Closed" 
                  ? "border-blue-100 text-blue-600 hover:bg-blue-50 bg-blue-50/30" 
                  : "border-orange-100 text-orange-600 hover:bg-orange-50 bg-orange-50/30"
                }`}
              >
                {selectedInternship.status === "Closed" ? <><Unlock size={20} /> Reopen</> : <><Lock size={20} /> Close</>}
              </button>
              
              <button onClick={handleUpdate} className="flex-[1.5] bg-[#7C3AED] text-white py-4 rounded-2xl font-bold hover:bg-[#5b1dbf] shadow-xl shadow-purple-200 transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;