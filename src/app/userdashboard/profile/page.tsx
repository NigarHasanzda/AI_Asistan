"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";

// --- TYPES ---
interface MatchedInternshipParams {
  IsPaid?: boolean;
  CompanyName?: string;
  LocationType?: number;
}

// --- SERVICES ---
// Profil məlumatını əldə et
const GetStudentProfile = async (token: string) => {
  try {
    const response = await api.get("/Students/get-profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.log("Get profile error:", error.response?.data || error.message);
    throw error;
  }
};

// Profil analizi
const analyzeProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");
  try {
    const response = await api.get("/Students/analyze-profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Profil analizi zamanı xəta:", error.response?.data || error.message);
    throw error;
  }
};

// Dashboard
const getStudentDashboard = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");
  try {
    const response = await api.get("/Students/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Dashboard əldə edilərkən xəta:", error.response?.data || error.message);
    throw error;
  }
};

// Matched Internships
const getMatchedInternships = async (params: MatchedInternshipParams = {}) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");
  try {
    const response = await api.get("/Students/matched-internships", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error("Internships alınarkən xəta:", error.response?.data || error.message);
    throw error;
  }
};

// Profil yeniləmə
const updateStudentProfile = async (data: { fullname: string; targetJobId: number }) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");
  try {
    const response = await api.patch("/Students/update-profile", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Profil yenilənərkən xəta:", error.response?.data || error.message);
    throw error;
  }
};

// --- COMPONENT ---
export default function Page() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("experience");
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);
  const [dashLoading, setDashLoading] = useState(false);
  const [matchedInternships, setMatchedInternships] = useState<any[]>([]);
  const [loadingInternships, setLoadingInternships] = useState(false);

  // --- Filters ---
  const [filterIsPaid, setFilterIsPaid] = useState<boolean>(true);
  const [filterCompanyName, setFilterCompanyName] = useState<string>("");

  // --- Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFullname, setEditFullname] = useState("");
  const [editTargetJobId, setEditTargetJobId] = useState<number | null>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  // --- FETCH PROFILE ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setProfile(null); setLoading(false); return; }
      try {
        const data = await GetStudentProfile(token);
        if (!data || Object.keys(data).length === 0) setProfile(null);
        else {
          setProfile(data);
          setEditFullname(data.fullname || "");
          setEditTargetJobId(data.targetJobId || null);
        }
      } catch (error) {
        console.error("Xəta baş verdi:", error);
        setProfile(null);
      } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  // --- HANDLERS ---
  const handleAnalyze = async () => {
    setAnalyzing(true);
    try { const data = await analyzeProfile(); setAnalysis(data); }
    catch (error) { console.error(error); }
    finally { setAnalyzing(false); }
  };

  const handleDashboard = async () => {
    setDashLoading(true);
    try { const data = await getStudentDashboard(); setDashboard(data); }
    catch (error) { console.error(error); }
    finally { setDashLoading(false); }
  };

  const handleMatchedInternships = async () => {
    setLoadingInternships(true);
    try {
      const params: MatchedInternshipParams = {
        IsPaid: filterIsPaid,
        CompanyName: filterCompanyName || undefined,
        LocationType: 1,
      };
      const data = await getMatchedInternships(params);
      setMatchedInternships(data || []);
    } catch (error) { console.error(error); }
    finally { setLoadingInternships(false); }
  };

  const handleUpdateProfile = async () => {
    if (!editFullname || editTargetJobId === null) return;
    setUpdatingProfile(true);
    try {
      const updated = await updateStudentProfile({
        fullname: editFullname,
        targetJobId: editTargetJobId,
      });
      setProfile({ ...profile, fullname: updated.fullname, targetJobId: updated.targetJobId, targetJobName: updated.targetJobName });
      setUpdateMessage("Profil uğurla yeniləndi!");
      setTimeout(() => setUpdateMessage(""), 3000);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      setUpdateMessage("Profil yenilənmədi, yenidən cəhd edin.");
      setTimeout(() => setUpdateMessage(""), 3000);
    } finally { setUpdatingProfile(false); }
  };

  // --- LOADING / ERROR ---
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-gray-400 font-medium tracking-widest text-sm uppercase">Yüklənir</span>
      </div>
    </div>
  );
  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 text-lg font-semibold">
      Profil tapılmadı.
    </div>
  );

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 p-6 md:p-12">

        {/* LEFT PANEL */}
        <aside className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 sticky top-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="mb-4 w-full bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Profil Yenilə
            </button>

            <div className="relative w-24 h-24 mb-6 mx-auto md:mx-0">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt={profile.fullname} className="w-full h-full rounded-2xl object-cover ring-4 ring-slate-50" />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                  {profile.fullname?.charAt(0)}
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 leading-tight">{profile.fullname}</h1>
            <p className="text-blue-600 font-semibold text-sm mt-1 uppercase tracking-wider">{profile.targetJobName}</p>

            <div className="my-6 border-t border-slate-50"></div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-[2px] text-slate-400 font-bold">İstifadəçi adı</label>
                <p className="text-slate-700 font-medium">@{profile.username}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[2px] text-slate-400 font-bold">Bacarıqlar</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills?.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium">{skill}</span>
                  ))}
                </div>
              </div>

              <button onClick={handleAnalyze} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50" disabled={analyzing}>
                {analyzing ? "Analiz edilir..." : "Profil Analiz Et"}
              </button>

              <button onClick={handleDashboard} className="mt-2 w-full bg-green-600 text-white py-2 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50" disabled={dashLoading}>
                {dashLoading ? "Yüklənir..." : "Dashboardu Yüklə"}
              </button>

              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-slate-600">Ödənişli?</label>
                <select className="w-full border border-slate-300 rounded-lg p-2" value={filterIsPaid ? "true" : "false"} onChange={(e) => setFilterIsPaid(e.target.value === "true")}>
                  <option value="true">Ödənişli</option>
                  <option value="false">Ödənişsiz</option>
                </select>

                <label className="block text-sm font-medium text-slate-600 mt-2">Şirkət adı</label>
                <input type="text" placeholder="Şirkət adı daxil edin..." className="w-full border border-slate-300 rounded-lg p-2" value={filterCompanyName} onChange={(e) => setFilterCompanyName(e.target.value)} />

                <button onClick={handleMatchedInternships} className="mt-2 w-full bg-purple-600 text-white py-2 rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-50" disabled={loadingInternships}>
                  {loadingInternships ? "Yüklənir..." : "Uyğun İnternşipləri Göstər"}
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <main className="flex-1">
          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-slate-200">
            {[
              { id: "experience", label: "İş Təcrübəsi", icon: "💼" },
              { id: "projects", label: "Layihələr", icon: "🚀" }
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab.id ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}>
                <span className="mr-2">{tab.icon}</span>{tab.label}
                {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />}
              </button>
            ))}
          </div>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "experience" && (
              <div className="grid gap-4">
                {profile.experiences?.length > 0 ? profile.experiences.map((exp: any) => (
                  <div key={exp.id} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{exp.designation}</h3>
                        <p className="text-slate-500 font-medium">{exp.companyName}</p>
                      </div>
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full whitespace-nowrap">
                        {new Date(exp.startDate).getFullYear()} — {new Date(exp.endDate).getFullYear()}
                      </span>
                    </div>
                    <p className="mt-4 text-slate-600 leading-relaxed text-sm">{exp.description}</p>
                  </div>
                )) : <p className="text-slate-500 text-sm font-medium">İş təcrübəsi tapılmadı.</p>}
              </div>
            )}
            {activeTab === "projects" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {profile.projects?.length > 0 ? profile.projects.map((project: any) => (
                  <div key={project.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl mb-4 text-blue-500 border border-slate-100">◈</div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{project.name}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.skillNames?.map((s: string) => <span key={s} className="text-[10px] font-bold uppercase tracking-wider text-slate-400">#{s}</span>)}
                      </div>
                    </div>
                    <a href={project.projectUrl} target="_blank" className="inline-flex items-center text-blue-600 font-bold text-sm hover:gap-2 transition-all">Layihəni araşdır <span className="ml-1">→</span></a>
                  </div>
                )) : <p className="text-slate-500 text-sm font-medium">Layihə tapılmadı.</p>}
              </div>
            )}
          </div>
        </main>
        {/* ANALYSIS & DASHBOARD */}
        {(analysis || dashboard) && (
          <div className="mt-8 space-y-6">
            {/* Profil Analizi */}
            {analysis && (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Profil Analizi Nəticələri</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                  {Object.entries(analysis).map(([key, value]: [string, any]) => (
                    <li key={key}>
                      <span className="font-semibold text-slate-800">{key}:</span> {JSON.stringify(value)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dashboard */}
            {dashboard && (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Dashboard Nəticələri</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                  {Object.entries(dashboard).map(([key, value]: [string, any]) => (
                    <li key={key}>
                      <span className="font-semibold text-slate-800">{key}:</span> {JSON.stringify(value)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}


        {/* EDIT PROFILE MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Profil Yenilə</h2>
              <input type="text" placeholder="Tam ad" className="w-full p-2 border border-slate-300 rounded-lg mb-2" value={editFullname} onChange={(e) => setEditFullname(e.target.value)} />
              <input type="number" placeholder="Target Job ID" className="w-full p-2 border border-slate-300 rounded-lg mb-2" value={editTargetJobId ?? ""} onChange={(e) => setEditTargetJobId(Number(e.target.value))} />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Ləğv et</button>
                <button onClick={handleUpdateProfile} disabled={updatingProfile} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                  {updatingProfile ? "Yenilənir..." : "Yenilə"}
                </button>
              </div>
              {updateMessage && <p className="mt-2 text-sm text-green-600">{updateMessage}</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}