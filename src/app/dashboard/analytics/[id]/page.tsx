"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  Search,
  UserCheck,
  UserX,
  Star
} from "lucide-react";
import { getInternshipApplications } from "@/services/InternshipServices";
import { decideApplication, shortlistApplication, removeShortlistApplication } from "@/services/CompanyServices";
import toast, { Toaster } from "react-hot-toast";

// --- TYPES ---
interface Applicant {
  id: number;
  fullname: string;
  overallMatchScore: number;
  status?: "Pending" | "Accepted" | "Rejected"; // backend status
  isShortlisted: boolean;
  photoUrl: string;
}

interface ApplicantRowProps extends Applicant {
  onAccept: () => void;
  onReject: () => void;
  onShortlist: (applicationId: number, isCurrentlyShortlisted: boolean) => void;
}

// Status tərcüməsi
const statusMap: Record<string, string> = {
  Pending: "Gözləmədə",
  Accepted: "Qəbul",
  Rejected: "İmtina",
  Shortlisted: "Baxilacaqlar siyahisina alındı"
};

const ViewApplicants = () => {
  const params = useParams();
  const router = useRouter();
  const internshipId = Number(params?.id);

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "Pending" | "Accepted" | "Rejected">("all");

  // Reject modal
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    applicationId: number | null;
  }>({ open: false, applicationId: null });

  const [rejectReason, setRejectReason] = useState("");

  // --- FETCH ---
  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await getInternshipApplications(internshipId, {
        page: 1,
        pageSize: 1000,
        Keyword: searchQuery,
      });
      const data: Applicant[] = response.items || response || [];
      setApplicants(data);
    } catch (error) {
      console.error(error);
      toast.error("Müraciətçilər yüklənmədi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [internshipId]);

  // --- DECISION HANDLER ---
  const handleDecision = async (
    applicationId: number,
    isAccepted: boolean,
    reason?: string
  ) => {
    try {
      const token = localStorage.getItem("token") || "";
      await decideApplication({ applicationId, isAccepted, reason }, token);

      setApplicants((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: isAccepted ? "Accepted" : "Rejected" }
            : app
        )
      );

      toast.success(
        isAccepted ? "Müraciət qəbul edildi!" : "Müraciət imtina edildi!"
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Xəta baş verdi");
    }
  };

  // --- SHORTLIST HANDLER (toggle) ---
  const handleShortlist = async (applicationId: number, isCurrentlyShortlisted: boolean) => {
    try {
      const token = localStorage.getItem("token") || "";

      if (isCurrentlyShortlisted) {
        await removeShortlistApplication(internshipId, applicationId, token);
        setApplicants((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, isShortlisted: false } : app
          )
        );
        toast.success("Müraciət shortlist-dən çıxarıldı!");
      } else {
        await shortlistApplication(internshipId, applicationId, token);
        setApplicants((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, isShortlisted: true } : app
          )
        );
        toast.success("Müraciət shortlist-ə əlavə olundu!");
      }
    } catch (error: any) {
      console.error("Shortlist error:", error);
      toast.error(error.message || "Xəta baş verdi");
    }
  };

  // --- FILTERED LIST ---
  const filteredApplicants = applicants.filter((a) => {
    if (searchQuery && !a.fullname.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;

    if (activeTab === "all") return true;
    return a.status === activeTab || (activeTab === "Pending" && !a.status);
  });

  return (
    <div className="min-h-screen p-6 font-sans">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* TOP */}
        <div className="flex justify-between">
          <button onClick={() => router.back()} className="flex gap-2">
            <ChevronLeft /> Geri
          </button>
        </div>

        {/* HEADER */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black">Müraciətçilər</h1>
            <p>{applicants.length} nəfər</p>
          </div>

          <div className="relative">
            <Search className="absolute left-2 top-3" size={18} />
            <input
              className="pl-8 border p-2 rounded-xl"
              placeholder="Axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* TABS */}
        <div className="flex gap-2">
          {[
            { key: "all", label: "Hamısı" },
            { key: "Pending", label: "Gözləmədə" },
            { key: "Accepted", label: "Qəbul" },
            { key: "Rejected", label: "İmtina" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded ${
                activeTab === tab.key ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : filteredApplicants.length > 0 ? (
            filteredApplicants.map((a) => (
              <ApplicantRow
                key={a.id}
                {...a}
                onAccept={() => handleDecision(a.id, true)}
                onReject={() => setRejectModal({ open: true, applicationId: a.id })}
                onShortlist={(applicationId, isShortlisted) =>
                  handleShortlist(applicationId, isShortlisted)
                }
              />
            ))
          ) : (
            <p>Heç bir istifadəçi tapılmadı</p>
          )}
        </div>
      </div>

      {/* REJECT MODAL */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
            <h2 className="font-bold text-lg">İmtina səbəbi</h2>

            <textarea
              className="w-full border p-2 rounded"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setRejectModal({ open: false, applicationId: null });
                  setRejectReason("");
                }}
              >
                Ləğv et
              </button>

              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  if (!rejectReason.trim()) {
                    toast.error("Səbəb yazın!");
                    return;
                  }

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

// --- ROW ---
const ApplicantRow = ({
  fullname,
  overallMatchScore,
  status,
  isShortlisted,
  photoUrl,
  id,
  onAccept,
  onReject,
  onShortlist
}: ApplicantRowProps) => {
  const isDecided = status === "Accepted" || status === "Rejected";

  return (
    <div className="flex justify-between items-center border p-4 rounded-xl">
      <div className="flex items-center gap-4">
        <img
          src={photoUrl || "https://ui-avatars.com/api/?name=" + fullname}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-bold">{fullname}</p>
          <p className="text-sm text-gray-400">{statusMap[status || "Pending"]}</p>
          <p className="text-sm text-gray-400">{overallMatchScore}% uyğunluq</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onReject} className="text-red-500" disabled={isDecided}>
          <UserX />
        </button>
        <button onClick={onAccept} className="text-green-600" disabled={isDecided}>
          <UserCheck />
        </button>
        <button
          onClick={() => onShortlist(id, isShortlisted)}
          className={`text-yellow-500 ${isDecided ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Star />
        </button>
      </div>
    </div>
  );
};

export default ViewApplicants;