"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Briefcase, Rocket, Settings, Plus, X,
  ExternalLink, ShieldCheck, Camera, Save,
  Mail, Send, GraduationCap, Trash, Edit2, User, Calendar
} from "lucide-react";
import api from "@/libs/api";
import { deleteAccount } from "@/services/Auth";
import { CreateExperience, CreateProject, CreateStudentSkill } from "@/services/CreateStudent";
import { deleteStudentSkill, updateFullStudentProfile } from "@/services/StudentProfile";
import { GetTargetJobs } from "@/services/TargetJob";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("experience");

  console.log(profile)
  // --- MODALS STATES ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  // --- DATA & EDIT STATES ---
  const [targetJobs, setTargetJobs] = useState<{ id: number; name: string }[]>([]);
  const [editFullname, setEditFullname] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editTargetJobId, setEditTargetJobId] = useState<number | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // --- SKILL STATES ---
  const [newSkill, setNewSkill] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);
  const [deletingSkillId, setDeletingSkillId] = useState<number | null>(null);

  // --- EXP & PROJ STATES ---
  const [editingExpId, setEditingExpId] = useState<number | null>(null);
  const [expData, setExpData] = useState({
    companyName: "",
    designation: "",
    startDate: "",
    endDate: "",
    description: ""
  });

  const [editingProjId, setEditingProjId] = useState<number | null>(null);
  const [projData, setProjData] = useState({
    name: "",
    description: "",
    projectUrl: "",
    skillNames: ""
  });

  const [addingExp, setAddingExp] = useState(false);
  const [addingProj, setAddingProj] = useState(false);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);
    try {
      const profileRes = await api.get("/Students/get-profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = profileRes.data;
      setProfile(data);
      setEditFullname(data.fullname || "");
      setEditUsername(data.username || "");
      setEditTargetJobId(data.targetJobId || null);
      setPreviewUrl(data.photoUrl || "");
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    GetTargetJobs().then(setTargetJobs);
  }, [fetchData]);

  // --- PHOTO HANDLER ---
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- CORE UPDATE ---
  const handleUpdateEverything = async () => {
    setUpdatingProfile(true);
    try {
      const formData = new FormData();
      formData.append("Fullname", editFullname);
      formData.append("Username", editUsername);
      formData.append("TargetJobId", String(editTargetJobId || ""));
      if (selectedPhoto) formData.append("Photo", selectedPhoto);

      await updateFullStudentProfile(formData);
      setIsEditModalOpen(false);
      await fetchData();
      alert("Profil uğurla yeniləndi!");
    } catch (error) { alert("Xəta baş verdi!"); }
    finally { setUpdatingProfile(false); }
  };

  // --- EXPERIENCE HANDLERS ---
  const openEditExp = (exp: any) => {
    setEditingExpId(exp.id);
    setExpData({
      companyName: exp.companyName,
      designation: exp.designation,
      startDate: exp.startDate?.split('T')[0] || "",
      endDate: exp.endDate?.split('T')[0] || "",
      description: exp.description
    });
    setIsExpModalOpen(true);
  };

  const handleSaveExp = async () => {
    const token = localStorage.getItem("token") || "";
    setAddingExp(true);
    try {
      // Tarixləri API-nın gözlədiyi formatda hazırlayırıq
      const payload = {
        ...expData,
        startDate: expData.startDate ? new Date(expData.startDate).toISOString() : new Date().toISOString(),
        endDate: expData.endDate ? new Date(expData.endDate).toISOString() : new Date().toISOString(),
      };

      if (editingExpId) {
        await api.patch(`/Experiences/${editingExpId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await CreateExperience(payload, token);
      }
      await fetchData();
      setIsExpModalOpen(false);
      setEditingExpId(null);
      setExpData({ companyName: "", designation: "", startDate: "", endDate: "", description: "" });
    } catch (err) { alert("Xəta baş verdi! Tarixləri düzgün daxil edin."); }
    finally { setAddingExp(false); }
  };

  // --- PROJECT HANDLERS ---
  const handleSaveProj = async () => {
    const token = localStorage.getItem("token") || "";
    setAddingProj(true);
    try {
      const skillArray = projData.skillNames.split(",").map(s => s.trim()).filter(s => s !== "");
      const payload = { ...projData, skillNames: skillArray };

      if (editingProjId) {
        await api.patch(`/Projects/${editingProjId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await CreateProject(payload, token);
      }
      await fetchData();
      setIsProjModalOpen(false);
      setEditingProjId(null);
      setProjData({ name: "", description: "", projectUrl: "", skillNames: "" });
    } catch (err) { alert("Xəta baş verdi!"); }
    finally { setAddingProj(false); }
  };

  const openEditProj = (proj: any) => {
    setEditingProjId(proj.id);
    setProjData({
      name: proj.name,
      description: proj.description,
      projectUrl: proj.projectUrl,
      skillNames: Array.isArray(proj.skills) ? proj.skills.join(", ") : ""
    });
    setIsProjModalOpen(true);
  };

  // --- SKILL HANDLERS ---
  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    const token = localStorage.getItem("token") || "";
    setAddingSkill(true);
    try {
      await CreateStudentSkill(newSkill, token);
      setNewSkill("");
      await fetchData();
    } catch (err) { alert("Skill əlavə edilə bilmədi."); }
    finally { setAddingSkill(false); }
  };

  const handleDeleteSkill = async (skillId: number) => {
    if (!confirm("Bu bacarığı silmək istədiyinə əminsən?")) return;
    setDeletingSkillId(skillId);
    try {
      await deleteStudentSkill(skillId);
      await fetchData();
    } catch (err) { alert("Xəta!"); }
    finally { setDeletingSkillId(null); }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Hesabı silmək istədiyinə əminsən? Bu əməliyyat geri qaytarıla bilməz.")) return;
    try {
      await deleteAccount();
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) { alert("Xəta!"); }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-indigo-600 font-black tracking-widest uppercase text-xs">Syncing Profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-indigo-100">
      {/* HEADER BACKGROUND */}
      <div className="h-72 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.3),transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR: STUDENT CARD */}
          <aside className="w-full lg:w-96 flex-shrink-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[48px] p-8 shadow-2xl border border-white sticky top-10">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-8 group">
                  <img src={previewUrl || "/default-avatar.png"} className="w-44 h-44 rounded-[56px] object-cover -mt-28 ring-[16px] ring-white shadow-2xl bg-slate-100 transition-transform group-hover:scale-105" alt="Avatar" />
                  <button onClick={() => setIsEditModalOpen(true)} className="absolute bottom-2 right-2 p-3 bg-indigo-600 text-white rounded-2xl border-4 border-white hover:bg-slate-900 transition-colors">
                    <Camera size={20} />
                  </button>
                </div>

                <h1 className="text-3xl font-black text-slate-900 mb-2">{profile?.fullname}</h1>
                <p className="text-slate-400 font-semibold text-sm mb-8 flex items-center gap-2 justify-center">
                  <User size={16} className="text-indigo-500" /> @{profile?.username}
                </p>

                <div className="w-full p-4 bg-indigo-50 rounded-[28px] border border-indigo-100/50 flex items-center justify-center gap-3 mb-10">
                  <ShieldCheck size={18} className="text-indigo-600" />
                  <span className="text-indigo-700 font-black text-xs uppercase tracking-widest">
                    {profile?.targetJobName || "Candidate"}
                  </span>
                </div>

                <div className="w-full space-y-4">
                  <button onClick={() => setIsEditModalOpen(true)} className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-[24px] font-black text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                    <Settings size={18} /> Edit Core Profile
                  </button>
                  <button onClick={() => setIsSkillModalOpen(true)} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-700 py-5 rounded-[24px] font-black text-sm hover:bg-slate-50 transition-all">
                    <Plus size={18} className="text-indigo-600" /> Manage Skills
                  </button>
                  <button onClick={handleDeleteAccount} className="text-[10px] font-black text-red-300 uppercase tracking-[0.2em] hover:text-red-500 pt-4 transition-colors">Terminate Account</button>
                </div>
              </div>
            </motion.div>
          </aside>

          {/* MAIN CONTENT: TABS */}
          <main className="flex-1 min-w-0">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[48px] shadow-2xl border border-white overflow-hidden">
              <div className="flex p-4 bg-slate-50/50 border-b border-slate-100">
                <button onClick={() => setActiveTab("experience")} className={`flex-1 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${activeTab === "experience" ? "bg-white text-indigo-600 shadow-xl" : "text-slate-400 hover:text-slate-600"}`}><Briefcase size={20} /> Experience</button>
                <button onClick={() => setActiveTab("projects")} className={`flex-1 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${activeTab === "projects" ? "bg-white text-indigo-600 shadow-xl" : "text-slate-400 hover:text-slate-600"}`}><Rocket size={20} /> Portfolio</button>
              </div>

              <div className="p-12">
                <AnimatePresence mode="wait">
                  {activeTab === "experience" ? (
                    <motion.div key="exp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                      <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-black italic text-slate-900 tracking-tighter uppercase">Experiences</h2>
                        <button onClick={() => { setEditingExpId(null); setExpData({ companyName: "", designation: "", startDate: "", endDate: "", description: "" }); setIsExpModalOpen(true); }} className="w-14 h-14 bg-indigo-600 text-white rounded-[20px] flex items-center justify-center hover:rotate-90 transition-all shadow-lg shadow-indigo-100"><Plus size={28} /></button>
                      </div>

                      {profile?.experiences?.length > 0 ? profile.experiences.map((exp: any) => (
                        <div key={exp.id} className="group relative pl-12 border-l-4 border-slate-100 hover:border-indigo-200 transition-colors pb-6">
                          <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-white border-[6px] border-indigo-600" />
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-black text-2xl text-slate-900">{exp.designation}</h3>
                              <p className="text-indigo-600 font-black text-xs uppercase tracking-widest mt-1">{exp.companyName}</p>
                              <div className="flex items-center gap-2 mt-2 text-slate-400 text-[11px] font-bold">
                                <Calendar size={12} />
                                {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                              </div>
                            </div>
                            <button onClick={() => openEditExp(exp)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Edit2 size={18} /></button>
                          </div>
                          <div className="bg-slate-50 rounded-[32px] p-8 text-slate-500 italic border border-slate-100 group-hover:bg-white group-hover:shadow-lg transition-all mt-4 leading-relaxed">
                            "{exp.description}"
                          </div>
                        </div>
                      )) : <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-slate-400 font-bold">No experience added yet.</div>}
                    </motion.div>
                  ) : (
                    <motion.div key="proj" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                      <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-black italic text-slate-900 tracking-tighter uppercase">Portfolio</h2>
                        <button onClick={() => { setEditingProjId(null); setProjData({ name: "", description: "", projectUrl: "", skillNames: "" }); setIsProjModalOpen(true); }} className="w-14 h-14 bg-indigo-600 text-white rounded-[20px] flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-indigo-100"><Plus size={28} /></button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {profile?.projects?.length > 0 ? profile.projects.map((proj: any) => (
                          <div key={proj.id} className="group p-10 rounded-[40px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl transition-all flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="font-black text-2xl text-slate-800 group-hover:text-indigo-600 transition-colors">{proj.name}</h3>
                              <button onClick={() => openEditProj(proj)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Edit2 size={18} /></button>
                            </div>
                            <p className="text-slate-500 text-sm mb-10 line-clamp-3 leading-relaxed flex-grow">{proj.description}</p>
                            <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-3 text-[11px] font-black text-white bg-slate-900 px-6 py-4 rounded-2xl uppercase tracking-widest hover:bg-indigo-600 transition-all">
                              Inspect Project <ExternalLink size={16} />
                            </a>
                          </div>
                        )) : <div className="col-span-full text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-slate-400 font-bold">Your portfolio gallery is empty.</div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </main>
        </div>
      </div>

      {/* MODAL: CORE EDIT */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[60px] w-full max-w-4xl p-14 relative overflow-y-auto max-h-[90vh]">
              <button onClick={() => setIsEditModalOpen(false)} className="absolute right-10 top-10 p-4 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"><X size={28} /></button>

              <h2 className="text-4xl font-black italic uppercase text-slate-900 mb-12">Core Profile Info</h2>

              <div className="grid md:grid-cols-[220px_1fr] gap-12 items-center mb-16">
                <div className="relative group mx-auto">
                  <img src={previewUrl || "/default-avatar.png"} className="w-52 h-52 rounded-[64px] object-cover border-[12px] border-slate-50 shadow-2xl transition-transform group-hover:scale-95 duration-500" />
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-600/80 text-white opacity-0 group-hover:opacity-100 rounded-[64px] transition-all cursor-pointer">
                    <Camera size={40} />
                    <input type="file" hidden onChange={handlePhotoChange} accept="image/*" />
                  </label>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Full Legal Name</span>
                    <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-[28px] p-6 outline-none focus:border-indigo-600 font-bold text-xl transition-all" value={editFullname} onChange={e => setEditFullname(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Username (@handle)</span>
                    <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-[28px] p-6 outline-none focus:border-indigo-600 font-bold text-xl transition-all" value={editUsername} onChange={e => setEditUsername(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Target Career Path</span>
                    <div className="relative">
                      <select
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[28px] p-6 outline-none focus:border-indigo-600 font-bold text-xl cursor-pointer appearance-none"
                        value={editTargetJobId || ""}
                        onChange={(e) => setEditTargetJobId(Number(e.target.value))}
                      >
                        <option value="">Select Specialization...</option>
                        {targetJobs.map(job => <option key={job.id} value={job.id}>{job.name}</option>)}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Briefcase size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={handleUpdateEverything} disabled={updatingProfile} className="w-full py-7 bg-indigo-600 text-white font-black rounded-[32px] hover:bg-slate-900 transition-all text-2xl flex items-center justify-center gap-4 disabled:opacity-50">
                {updatingProfile ? "Syncing..." : <><Save size={32} /> Confirm Update</>}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: EXPERIENCE (CREATE/UPDATE) */}
      <AnimatePresence>
        {isExpModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl">
              <h2 className="text-2xl font-black mb-8 italic uppercase text-slate-900">{editingExpId ? "Update" : "Add"} Experience</h2>
              <div className="space-y-5">
                <input placeholder="Company Name" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none font-bold focus:border-indigo-600 transition-all" value={expData.companyName} onChange={e => setExpData({ ...expData, companyName: e.target.value })} />
                <input placeholder="Job Title" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none font-bold focus:border-indigo-600 transition-all" value={expData.designation} onChange={e => setExpData({ ...expData, designation: e.target.value })} />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase ml-2">Start Date</span>
                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold text-sm focus:border-indigo-600 transition-all" value={expData.startDate} onChange={e => setExpData({ ...expData, startDate: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase ml-2">End Date</span>
                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold text-sm focus:border-indigo-600 transition-all" value={expData.endDate} onChange={e => setExpData({ ...expData, endDate: e.target.value })} />
                  </div>
                </div>

                <textarea placeholder="Tell us about your impact..." rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-indigo-600 transition-all" value={expData.description} onChange={e => setExpData({ ...expData, description: e.target.value })} />

                <button onClick={handleSaveExp} disabled={addingExp} className="w-full py-5 font-black text-white bg-indigo-600 rounded-[24px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50">
                  {addingExp ? "Saving..." : editingExpId ? "Save Changes" : "Record Experience"}
                </button>
                <button onClick={() => { setIsExpModalOpen(false); setEditingExpId(null); }} className="w-full py-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600">Discard</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: PROJECT (CREATE/UPDATE) */}
      <AnimatePresence>
        {isProjModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl">
              <h2 className="text-2xl font-black mb-8 italic uppercase text-slate-900">{editingProjId ? "Update" : "Launch"} Project</h2>
              <div className="space-y-5">
                <input placeholder="Project Title" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none font-bold focus:border-indigo-600 transition-all" value={projData.name} onChange={e => setProjData({ ...projData, name: e.target.value })} />
                <input placeholder="Deployment URL (https://...)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none font-bold focus:border-indigo-600 transition-all" value={projData.projectUrl} onChange={e => setProjData({ ...projData, projectUrl: e.target.value })} />
                <input placeholder="Tech Stack (Next.js, Tailwind, etc.)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none font-bold focus:border-indigo-600 transition-all" value={projData.skillNames} onChange={e => setProjData({ ...projData, skillNames: e.target.value })} />
                <textarea placeholder="Describe the problem you solved..." rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-indigo-600 transition-all" value={projData.description} onChange={e => setProjData({ ...projData, description: e.target.value })} />

                <button onClick={handleSaveProj} disabled={addingProj} className="w-full py-5 font-black text-white bg-indigo-600 rounded-[24px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50">
                  {addingProj ? "Saving..." : editingProjId ? "Save Changes" : "Add to Portfolio"}
                </button>
                <button onClick={() => { setIsProjModalOpen(false); setEditingProjId(null); }} className="w-full py-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600">Dismiss</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: SKILL MANAGER */}
      <AnimatePresence>
        {isSkillModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSkillModalOpen(false)} className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} className="bg-white rounded-[48px] w-full max-w-xl p-12 shadow-2xl relative z-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">Manage Skills</h2>
                <button onClick={() => setIsSkillModalOpen(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><X size={24} /></button>
              </div>

              <div className="relative mb-12">
                <input
                  value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="e.g. TypeScript"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[28px] py-6 px-8 outline-none focus:border-indigo-600 font-bold text-lg transition-all"
                />
                <button onClick={handleAddSkill} disabled={addingSkill || !newSkill.trim()} className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50 flex items-center gap-2">
                  {addingSkill ? "Adding..." : <><Send size={16} /> Add</>}
                </button>
              </div>

              <div className="flex flex-wrap gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {profile?.skills && profile.skills.length > 0 ? profile.skills.map((skill: any) => (
                  <div key={skill.id} className="group ...">
                    <span className="font-black ...">{skill.name || skill}</span>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)} // Index yox, ID göndər
                      className="..."
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                )) : <p className="text-slate-300 italic font-bold text-center w-full">No skills found.</p>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}