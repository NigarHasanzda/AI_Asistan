"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Building2,
  Briefcase,
  Calendar,
  Star,
  ExternalLink,
  Cpu,
  Trophy,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, PolarRadiusAxis 
} from "recharts";
import { getAdminApplicationById } from "@/services/Admin/Application";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  console.log(application);
  

  // Chart üçün data (nümunə olaraq matchScore-u bölürük)
  const chartData = application ? [
    { subject: 'Technical', A: application.matchScore, fullMark: 100 },
    { subject: 'Interview', A: application.interviewAverageScore, fullMark: 100 },
    { subject: 'Experience', A: application.experiences?.length * 20 || 50, fullMark: 100 },
    { subject: 'Projects', A: application.projects?.length * 30 || 60, fullMark: 100 },
    { subject: 'Skills', A: application.skills?.length * 10 || 70, fullMark: 100 },
  ] : [];

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const data = await getAdminApplicationById(id as string);
      setApplication(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
          <p className="text-slate-500 font-medium animate-pulse">Loading Application Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-10 bg-[#F8FAFC]">
      <div className="max-w-[100%] mx-auto">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 mb-8 text-slate-500 hover:text-indigo-600 transition-all font-semibold"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-indigo-50 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Back to List
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* PROFILE HEADER */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  application.applicationStatus === 'Accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {application.applicationStatus}
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center text-white shadow-lg">
                   <User size={40} />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-black text-slate-900 leading-tight">{application.fullName}</h1>
                  <p className="text-indigo-600 font-semibold mb-2">{application.targetJob}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><Building2 size={16}/> {application.companyName}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={16}/> {application.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI FEEDBACK AREA */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Cpu size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">AI Analysis & Feedback</h3>
              </div>
              <div className="relative p-6 bg-slate-50 rounded-2xl border-l-4 border-indigo-500">
                <p className="text-slate-700 leading-relaxed italic text-lg leading-relaxed">
                  "{application.aiMatchFeedback}"
                </p>
              </div>
            </div>

            {/* PROJECTS & EXPERIENCE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Projects */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                  <Trophy className="text-amber-500" size={20} /> Projects
                </h3>
                {application.projects?.map((project: any) => (
                  <div key={project.id} className="bg-white p-5 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                    <h4 className="font-bold text-slate-800 flex justify-between">
                      {project.name}
                      <a href={project.projectUrl} target="_blank" className="text-indigo-500 hover:scale-110 transition-transform"><ExternalLink size={16}/></a>
                    </h4>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-3">{project.description}</p>
                  </div>
                ))}
              </div>

              {/* Experience Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                  <Briefcase className="text-indigo-500" size={20} /> Experience
                </h3>
                <div className="space-y-6 pl-4 border-l-2 border-slate-100">
                  {application.experiences?.map((exp: any) => (
                    <div key={exp.id} className="relative">
                      <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white border-4 border-indigo-500" />
                      <h4 className="font-bold text-slate-800 leading-none">{exp.designation}</h4>
                      <p className="text-xs font-semibold text-indigo-500 mt-1">{exp.companyName}</p>
                      <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-tighter">
                        {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                      </p>
                      <p className="text-sm text-slate-500">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ANALYTICS & ACTIONS */}
          <div className="space-y-8">
            
            {/* SCORE CHART CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-center font-bold text-slate-800 mb-4">Competency Radar</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-indigo-50 p-4 rounded-2xl text-center">
                  <p className="text-xs font-bold text-indigo-400 uppercase">Match</p>
                  <p className="text-2xl font-black text-indigo-700">{application.matchScore}%</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl text-center">
                  <p className="text-xs font-bold text-purple-400 uppercase">Interview</p>
                  <p className="text-2xl font-black text-purple-700">{application.interviewAverageScore}</p>
                </div>
              </div>
            </div>

            {/* SKILLS TAGS */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {application.skills?.map((skill: any) => (
                  <span key={skill.id} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-100">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>


            {/* REJECTION REASON IF EXISTS */}
            {application.rejectionReason && (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5">
                <h4 className="text-rose-600 font-bold text-sm mb-2 flex items-center gap-2">
                  <XCircle size={16} /> Rejection Reason
                </h4>
                <p className="text-rose-800 text-sm leading-relaxed font-medium">
                  {application.rejectionReason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;