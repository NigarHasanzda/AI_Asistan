"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Loader2, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Clock, 
  Users, 
  Building2,
  DollarSign,
  Tag,
  ShieldCheck,
  Globe,
  ExternalLink,
  Pencil
} from "lucide-react";
import { getAdminInternshipById } from "@/services/Admin/Internship";

const InternshipDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const internshipId = Number(params.id);
  const [internship, setInternship] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInternship = async () => {
    try {
      setLoading(true);
      const res = await getAdminInternshipById(internshipId);
      setInternship(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (internshipId) fetchInternship();
  }, [internshipId]);

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString("en-US", { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
        <div className="relative flex items-center justify-center">
            <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
            <Loader2 className="absolute animate-pulse text-indigo-600" size={32} />
        </div>
        <p className="mt-6 text-slate-500 font-semibold tracking-wide animate-pulse">Fetching Internship Data...</p>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center border border-slate-100">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Position Not Found</h2>
            <p className="text-slate-500 mt-2">The internship you're looking for doesn't exist or was removed.</p>
            <button 
                onClick={() => router.back()} 
                className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
                Back to Dashboard
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#F8FAFC]">
      {/* Top Navbar Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-all group"
            >
                <div className="p-2 rounded-lg group-hover:bg-indigo-50 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span>Back to Listings</span>
            </button>
            
          
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Main Header Info */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8">
             <span className={`px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase ${
                 internship.isClosed ? "bg-red-50 text-red-600 ring-1 ring-red-200" : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
               }`}>
                 {internship.isClosed ? "Closed" : "Active"}
               </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl flex-shrink-0">
                <Briefcase size={40} />
            </div>
            
            <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                    {internship.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Building2 size={20} className="text-indigo-500" />
                    {internship.companyName}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-medium capitalize">
                    <Globe size={20} className="text-indigo-500" />
                    {internship.locationType === 2 ? "Remote Office" : "On-site Office"}
                  </div>
                  <div className="bg-indigo-50 text-indigo-700 px-4 py-1 rounded-lg text-sm font-bold">
                    {internship.departmentName}
                  </div>
                </div>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 p-6 bg-slate-50 rounded-3xl">
            <div className="flex flex-col items-center md:items-start p-2">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Total Applicants</span>
              <div className="flex items-center gap-2">
                <Users size={20} className="text-indigo-500" />
                <span className="text-2xl font-black text-slate-800">{internship.applicationCount}</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start p-2">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Compensation</span>
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-emerald-500" />
                <span className="text-2xl font-black text-slate-800">{internship.isPaid ? "Paid" : "Unpaid"}</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start p-2">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Commences</span>
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-amber-500" />
                <span className="text-lg font-bold text-slate-800">{formatDate(internship.startDate)}</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start p-2">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Application Deadline</span>
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-rose-500" />
                <span className="text-lg font-bold text-slate-800">{formatDate(internship.deadlineDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
                <h3 className="text-xl font-black text-slate-900">Job Description</h3>
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-[1.8] whitespace-pre-line text-lg">
                    {internship.description}
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
                <Tag size={20} className="text-indigo-500" /> Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {internship.skills?.map((skill: any) => (
                  <span key={skill.id} className="px-4 py-2 bg-slate-50 text-slate-700 text-sm font-bold rounded-xl border border-slate-100 hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-default">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-indigo-400" /> Admin Metadata
                </h3>
                <div className="space-y-5 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-slate-400 font-medium">Created On</span>
                    <span className="font-bold">{formatDate(internship.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-slate-400 font-medium">Internal End Date</span>
                    <span className="font-bold">{formatDate(internship.endDate)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-slate-400 font-medium">Payment Status</span>
                    <span className="font-bold bg-indigo-500 px-3 py-1 rounded-lg text-xs uppercase tracking-widest">{internship.paymentStatus}</span>
                    </div>
                </div>
                <div className="mt-8 p-4 bg-white/5 rounded-2xl text-center border border-white/5">
                    <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-black tracking-widest">
                        System Information Only visible to authorized administrators.
                    </p>
                </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailsPage;