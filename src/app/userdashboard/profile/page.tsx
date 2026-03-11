"use client";

import { GetStudentProfile } from "@/services/StudentProfile";
import { useEffect, useState } from "react";

export default function Page() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("experience");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }
      try {
        const data = await GetStudentProfile(token);
        setProfile(data);
      } catch (error) {
        console.error("Xəta baş verdi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-gray-400 font-medium tracking-widest text-sm uppercase">Yüklənir</span>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">
      Profil tapılmadı.
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 p-6 md:p-12">
        
        {/* Sol Panel - Profil Məlumatları */}
        <aside className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 sticky top-12">
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
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Sağ Panel - Əsas Məzmun */}
        <main className="flex-1">
          {/* Tab Naviqasiyası */}
          <div className="flex gap-8 mb-8 border-b border-slate-200">
            {[
              { id: "experience", label: "İş Təcrübəsi", icon: "💼" },
              { id: "projects", label: "Layihələr", icon: "🚀" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Məzmun sahəsi */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "experience" && (
              <div className="grid gap-4">
                {profile.experiences?.map((exp: any) => (
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
                    <p className="mt-4 text-slate-600 leading-relaxed text-sm">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "projects" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {profile.projects?.map((project: any) => (
                  <div key={project.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl mb-4 text-blue-500 border border-slate-100">
                        ◈
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{project.name}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.skillNames?.map((s: string) => (
                          <span key={s} className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            #{s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a 
                      href={project.projectUrl} 
                      target="_blank" 
                      className="inline-flex items-center text-blue-600 font-bold text-sm hover:gap-2 transition-all"
                    >
                      Layihəni araşdır <span className="ml-1">→</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}