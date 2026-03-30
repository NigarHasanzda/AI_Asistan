"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  Search,
  UserCheck,
  UserX,
  Star,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { getInternshipApplications } from "@/services/InternshipServices";
import { decideApplication, shortlistApplication, removeShortlistApplication } from "@/services/CompanyServices";
import toast, { Toaster } from "react-hot-toast";

// --- TYPES ---
interface Applicant {
  id: number;
  fullname: string;
  overallMatchScore: number;
  status?: "Pending" | "Accepted" | "Rejected";
  isShortlisted: boolean;
  photoUrl: string;
}

// Status tərcüməsi və rəngləri
const statusConfig: Record<string, { label: string; color: string }> = {
  Pending: { label: "Gözləmədə", color: "bg-amber-50 text-amber-600 border-amber-100" },
  Accepted: { label: "Qəbul", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  Rejected: { label: "İmtina", color: "bg-rose-50 text-rose-600 border-rose-100" },
  Shortlisted: { label: "Baxılacaqlar", color: "bg-indigo-50 text-indigo-600 border-indigo-100" }
};

const ViewApplicants = () => {
  const params = useParams();
  const router = useRouter();
  const internshipId = Number(params?.id);
 

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "Pending" | "Accepted" | "Rejected" | "Shortlisted">("all");

  const [rejectModal, setRejectModal] = useState<{ open: boolean; applicationId: number | null }>({ 
    open: false, 
    applicationId: null 
  });
  const [rejectReason, setRejectReason] = useState("");

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await getInternshipApplications(internshipId, {
        page: 1,
        pageSize: 1000,
        Keyword: searchQuery,
      });
      setApplicants(response.items || response || []);
    } catch (error) {
      toast.error("Müraciətçilər yüklənmədi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplicants(); }, [internshipId]);

  const handleDecision = async (applicationId: number, isAccepted: boolean, reason?: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      await decideApplication({ applicationId, isAccepted, reason }, token);
      setApplicants(prev => prev.map(app => app.id === applicationId ? { ...app, status: isAccepted ? "Accepted" : "Rejected" } : app));
      toast.success(isAccepted ? "Müraciət qəbul edildi!" : "Müraciət imtina edildi!");
    } catch (error: any) {
      toast.error(error.message || "Xəta baş verdi");
    }
  };

  const handleShortlist = async (applicationId: number, isCurrentlyShortlisted: boolean) => {
    try {
      const token = localStorage.getItem("token") || "";
      if (isCurrentlyShortlisted) {
        await removeShortlistApplication(internshipId, applicationId, token);
        setApplicants(prev => prev.map(app => app.id === applicationId ? { ...app, isShortlisted: false } : app));
        toast.success("Shortlist-dən çıxarıldı");
      } else {
        await shortlistApplication(internshipId, applicationId, token);
        setApplicants(prev => prev.map(app => app.id === applicationId ? { ...app, isShortlisted: true } : app));
        toast.success("Shortlist-ə əlavə olundu");
      }
    } catch (error: any) {
      toast.error(error.message || "Xəta baş verdi");
    }
  };

  // --- FILTERED LOGIC ---
  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch = a.fullname.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === "all") return true;
    if (activeTab === "Shortlisted") return a.isShortlisted;
    return a.status === activeTab || (activeTab === "Pending" && !a.status);
  });

  return (
    <div className="min-h-screen  text-slate-900 font-sans pb-20">
      <Toaster position="top-right" />
      
      <main className="max-w-[90%] mx-auto p-6 md:p-10 space-y-10">
        {/* Navigation */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors group"
        >
          <div className="p-2 rounded-xl bg-white border border-slate-100 group-hover:border-indigo-100 shadow-sm">
            <ChevronLeft size={18} />
          </div>
          Geri qayıt
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Müraciətçilər</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Filter size={16} /> Ümumi {applicants.length} müraciət tapıldı
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] w-full md:w-80 shadow-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all font-medium"
              placeholder="Ad ilə axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/50 w-fit rounded-2xl border border-slate-100">
          {[
            { key: "all", label: "Hamısı" },
            { key: "Pending", label: "Gözləmədə" },
            { key: "Shortlisted", label: "Baxılacaqlar" },
            { key: "Accepted", label: "Qəbul" },
            { key: "Rejected", label: "İmtina" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.key 
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Applicant List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 className="animate-spin text-indigo-600" size={40} />
              <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Yüklənir...</p>
            </div>
          ) : filteredApplicants.length > 0 ? (
            filteredApplicants.map((a) => (
              <ApplicantCard
                key={a.id}
                applicant={a}
                onAccept={() => handleDecision(a.id, true)}
                onReject={() => setRejectModal({ open: true, applicationId: a.id })}
                onShortlist={() => handleShortlist(a.id, a.isShortlisted)}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold text-lg">Heç bir nəticə tapılmadı</p>
            </div>
          )}
        </div>
      </main>

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-6 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl space-y-6">
            <div>
              <h2 className="font-black text-2xl text-slate-900">İmtina səbəbi</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Namizədə göndəriləcək rəsmi səbəbi qeyd edin.</p>
            </div>

            <textarea
              className="w-full border border-slate-100 bg-slate-50 p-4 rounded-2xl min-h-[120px] focus:ring-4 focus:ring-rose-50 focus:border-rose-200 outline-none transition-all"
              placeholder="Məsələn: Təcrübə səviyyəsi uyğun deyil..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors"
                onClick={() => { setRejectModal({ open: false, applicationId: null }); setRejectReason(""); }}
              >
                Ləğv et
              </button>
              <button
                className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95"
                onClick={async () => {
                  if (!rejectReason.trim()) return toast.error("Səbəb yazın!");
                  await handleDecision(rejectModal.applicationId!, false, rejectReason);
                  setRejectModal({ open: false, applicationId: null });
                  setRejectReason("");
                }}
              >
                İmtina et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Applicant Card Sub-component ---
const ApplicantCard = ({ applicant, onAccept, onReject, onShortlist }: any) => {
  const isDecided = applicant.status === "Accepted" || applicant.status === "Rejected";
  const currentStatus = applicant.status || "Pending";
    const router = useRouter();

  return (
    <div className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:shadow-indigo-100/30 hover:border-indigo-100 transition-all duration-300">
      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src={applicant.photoUrl || "https://ui-avatars.com/api/?name=" + applicant.fullname}
            className="w-16 h-16 rounded-[1.5rem] object-cover bg-slate-100 border-2 border-white shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
            <div className={`w-3 h-3 rounded-full ${applicant.overallMatchScore > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-lg text-slate-900 leading-tight">{applicant.fullname}</h3>
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusConfig[currentStatus].color}`}>
              {statusConfig[currentStatus].label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold">
            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{applicant.overallMatchScore}% Match</span>
            {applicant.isShortlisted && (
              <span className="flex items-center gap-1 text-amber-500 italic">
                <Star size={14} fill="currentColor" /> Baxılacaq
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6 md:mt-0">
        {/* Shortlist Toggle */}
        <button
          onClick={onShortlist}
          disabled={isDecided}
          className={`p-3.5 rounded-2xl border transition-all ${
            applicant.isShortlisted 
            ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-100" 
            : "bg-white border-slate-100 text-slate-400 hover:border-amber-200 hover:text-amber-500"
          } ${isDecided ? "opacity-30 cursor-not-allowed" : "active:scale-90"}`}
        >
          <Star size={20} fill={applicant.isShortlisted ? "white" : "none"} />
        </button>

        <div className="h-10 w-[1px] bg-slate-100 mx-1 hidden md:block" />

        <button
          onClick={onReject}
          disabled={isDecided}
          className={`p-3.5 rounded-2xl border border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all ${isDecided ? "opacity-30 cursor-not-allowed" : "active:scale-90"}`}
        >
          <UserX size={20} />
        </button>

        <button
          onClick={onAccept}
          disabled={isDecided}
          className={`p-3.5 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 transition-all ${isDecided ? "opacity-30 cursor-not-allowed" : "active:scale-95"}`}
        >
          <UserCheck size={20} />
        </button>
        
        <button
        onClick={()=>router.push(`/dashboard/applicant/${applicant.id}`)}
        className="p-3.5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
          <ArrowUpRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ViewApplicants;