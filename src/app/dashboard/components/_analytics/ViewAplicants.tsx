"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { getInternshipApplications } from "@/services/InternshipServices";

// --- Interfaces ---
interface Applicant {
  id: number;
  candidateName: string; // Backend-dən gələn ad sahəsi
  matchScore: number;
  status: number;
  email: string;
}

// --- Row Komponenti ---
const ApplicantRow = ({ id, candidateName, matchScore, status }: Applicant) => {
  // Score rəngini dinamik təyin edək
  const isHighMatch = matchScore >= 80;
  const scoreStyle = isHighMatch 
    ? "text-emerald-600 bg-emerald-50" 
    : "text-orange-600 bg-orange-50";

  return (
    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-full px-6 py-4 mb-4 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        {/* Profil Şəkli Placeholder */}
        <div className="w-12 h-12 rounded-full bg-[#1D3D33] flex items-center justify-center text-white font-bold">
          {candidateName?.charAt(0)}
        </div>
        
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-[18px] font-bold text-[#2563EB]">{candidateName}</h3>
            {/* Status göstəricisi (kiçik) */}
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
              {status === 0 ? "Pending" : status === 1 ? "Accepted" : "Rejected"}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-tight uppercase ${scoreStyle}`}>
            MATCH SCORE: {matchScore}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-6 py-2.5 border border-[#2563EB] text-[#2563EB] rounded-full text-[14px] font-bold hover:bg-blue-50 transition-all active:scale-95">
          Accept
        </button>
        <button className="px-6 py-2.5 bg-[#2563EB] text-white rounded-full text-[14px] font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
          Reject
        </button>
        <button className="ml-2 text-gray-300 group-hover:text-[#2563EB] transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

// --- Əsas Səhifə Komponenti ---
const ViewApplicants = () => {
  const params = useParams();
  const router = useRouter();
  const internshipId = Number(params.id); // URL-dəki /analytics/[id]

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (internshipId) {
      fetchData();
    }
  }, [internshipId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getInternshipApplications(internshipId, {
        page: 1,
        pageSize: 50
      });
      // Backend item-ləri "items" içində və ya birbaşa array kimi qaytara bilər
      setApplicants(response.items || response);
    } catch (error) {
      console.error("Müraciətlər yüklənmədi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 md:p-12 font-sans antialiased">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Geri Düyməsi və Başlıq */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-[#2563EB] mb-6 transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ChevronLeft size={20} /> Back to Manage
        </button>

        <header className="mb-12">
          <h1 className="text-[42px] font-black text-[#0F172A] leading-tight mb-2">
            View Applicants
          </h1>
          <div className="flex items-center gap-3">
             <div className="h-1 w-12 bg-[#2563EB] rounded-full"></div>
             <h2 className="text-[24px] font-bold text-gray-400 italic">
               ID: #{internshipId} Interns
             </h2>
          </div>
        </header>

        {/* Müraciət Siyahısı */}
        <div className="mt-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-bold">Müraciətlər axtarılır...</p>
            </div>
          ) : applicants.length > 0 ? (
            applicants.map((applicant) => (
              <ApplicantRow key={applicant.id} {...applicant} />
            ))
          ) : (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-[32px] p-20 text-center">
              <p className="text-gray-400 font-bold text-xl">Bu elana hələ müraciət yoxdur.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewApplicants;