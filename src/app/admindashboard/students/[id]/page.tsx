"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStudentById } from "@/services/Admin/Students";
import { 
  Mail, Briefcase, Star, ChevronLeft, MapPin, 
  Calendar, Globe, Linkedin, Github, Award, 
  Code, BookOpen, Rocket, CheckCircle2, Link as LinkIcon,
  Zap, Trophy, Target
} from "lucide-react";

const StudentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const studentId = Number(params.id);

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const res = await getStudentById(studentId);
        setStudent(res);
      } catch (err) {
        console.error("Fetch Student Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const getInitials = (name: string) => {
    if (!name) return "JS";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="text-indigo-600 font-bold animate-pulse">Məlumatlar gətirilir...</p>
      </div>
    </div>
  );

  if (!student) return (
    <div className="p-10 text-center">
      <p className="text-red-500 font-bold text-xl">Tələbə tapılmadı!</p>
      <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl shadow-lg">Geri qayıt</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-4 md:p-10 text-[#2B3674]">
      
      {/* --- TOP NAVIGATION & STATUS --- */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-bold group"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-indigo-50">
            <ChevronLeft size={20} />
          </div>
          Siyahıya qayıt
        </button>

        <div className="flex items-center gap-3">
            {student.isLeaderboardOptIn && (
                <span className="bg-green-100 text-green-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Trophy size={14} /> Leaderboard Active
                </span>
            )}
            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm border ${student.isPremium ? 'bg-amber-400 border-amber-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                {student.isPremium ? "Premium Plan ✨" : "Standard"}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT SIDE: PROFILE CARD --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-indigo-100/20 border border-white/50 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600 to-purple-700"></div>
            
            <div className="relative z-10">
              <div className="w-36 h-36 mx-auto rounded-[32px] border-8 border-white overflow-hidden bg-white shadow-2xl flex items-center justify-center">
                {student.photoUrl ? (
                  <img src={student.photoUrl} alt={student.fullname} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-indigo-600">{getInitials(student.fullname)}</span>
                )}
              </div>
              
              <h2 className="mt-6 text-3xl font-black tracking-tight">{student.fullname}</h2>
              <p className="text-indigo-500 font-bold text-lg mb-6">@{student.username}</p>
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F4F7FE] p-4 rounded-3xl border border-indigo-50">
                    <p className="text-2xl font-black text-indigo-600">{student.profileScore}%</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Profile Score</p>
                </div>
                <div className="bg-[#F4F7FE] p-4 rounded-3xl border border-indigo-50">
                    <p className="text-2xl font-black text-purple-600">{student.averageInterviewScore}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Interview Avg</p>
                </div>
              </div>

              {/* Info List */}
              <div className="space-y-4 text-left bg-slate-50/50 p-6 rounded-3xl">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="p-2 bg-white rounded-lg shadow-sm"><Mail size={18} className="text-indigo-500" /></div>
                  <span className="text-sm font-semibold truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="p-2 bg-white rounded-lg shadow-sm"><Target size={18} className="text-indigo-500" /></div>
                  <span className="text-sm font-semibold">{student.targetJobName}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="p-2 bg-white rounded-lg shadow-sm"><Zap size={18} className="text-indigo-500" /></div>
                  <span className="text-sm font-semibold">{student.totalApplications} Müraciət / {student.totalInterviews} Müsahibə</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI FEEDBACK CARD */}
          <div className="bg-[#111C44] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Rocket size={80} />
            </div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <Star className="text-amber-400 fill-amber-400" size={20}/> 
              </div>
              AI Profile Analysis
            </h3>
            <p className="text-indigo-100/80 text-sm leading-relaxed font-medium italic">
              "{student.aiProfileFeedback}"
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: CONTENT --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SKILLS SECTION */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-white">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black flex items-center gap-3">
                    <Code className="text-indigo-500" size={24} /> Texniki Bacarıqlar
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">
                    {student.skills?.length} Skills
                </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {student.skills?.map((skill: any) => (
                <div key={skill.id} className="flex items-center gap-2 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-2xl transition-all cursor-default border border-indigo-100 group">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:bg-white"></div>
                  <span className="text-sm font-bold uppercase tracking-wide">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* EXPERIENCE SECTION */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-white relative overflow-hidden">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <BookOpen className="text-indigo-500" size={24} /> İş Təcrübəsi
            </h3>
            <div className="space-y-10">
              {student.experiences?.map((exp: any) => (
                <div key={exp.id} className="relative pl-10 border-l-2 border-dashed border-slate-100">
                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-indigo-500 shadow-sm"></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h4 className="text-lg font-black text-[#1B2559]">{exp.designation}</h4>
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-tighter">
                       {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Davam edir'}
                    </span>
                  </div>
                  <p className="text-indigo-500 font-bold text-sm mb-4">{exp.companyName}</p>
                  <div className="bg-slate-50/50 p-5 rounded-3xl">
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                        {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PROJECTS SECTION */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-white">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <Award className="text-indigo-500" size={24} /> Top Layihələr
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {student.projects?.map((proj: any) => (
                <div key={proj.id} className="group p-6 rounded-[35px] bg-gradient-to-br from-[#F8F9FF] to-white border border-slate-100 hover:border-indigo-200 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-100/40">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="text-green-500" size={22} />
                    </div>
                    {proj.projectUrl && (
                        <a href={proj.projectUrl} target="_blank" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <LinkIcon size={18} />
                        </a>
                    )}
                  </div>
                  <h4 className="font-black text-lg mb-2 text-[#1B2559]">{proj.name}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;