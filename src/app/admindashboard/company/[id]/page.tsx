"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAdminCompanyById } from "@/services/Admin/Company";
import { 
  Building2, Mail, Globe, CheckCircle2, XCircle, Star, 
  ArrowLeft, Calendar, MapPin, Briefcase, Users, 
  ExternalLink, Ban, Clock
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from "recharts";

const CompanyPage = () => {
  const params = useParams();
  const router = useRouter();
  const companyId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(company);
  

  useEffect(() => {
    if (!companyId) return;
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const data = await getAdminCompanyById(companyId);
        setCompany(data);
      } catch (err) {
        setError("Failed to load company details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [companyId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error || !company) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <XCircle size={48} className="text-red-500 mb-4" />
      <p className="text-lg font-bold text-slate-800">{error || "Company not found"}</p>
      <button onClick={() => router.back()} className="mt-4 text-indigo-600 font-medium">Go Back</button>
    </div>
  );

  // Chart datası (Statistikalar üçün)
  const statsData = [
    { name: 'Internships', value: company.totalInternships || 0, color: '#4F46E5' },
    { name: 'Applications', value: company.totalApplicationsReceived || 0, color: '#10B981' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-900">
      <div className="max-w-[90%] mx-auto">
        
        {/* TOP NAVIGATION */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-semibold"
        >
          <ArrowLeft size={20} /> Back to Directory
        </button>

        {/* MAIN HEADER CARD */}
        <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img 
              src={company.photoUrl || "https://via.placeholder.com/150"} 
              alt={company.companyName}
              className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover shadow-lg border-4 border-white"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-slate-900">{company.companyName}</h1>
                {company.isPremium && (
                  <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest shadow-md shadow-indigo-100">
                    <Star size={12} fill="white" /> Premium
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-y-2 gap-x-6 text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Mail size={16} /> {company.email}</span>
                <span className="flex items-center gap-1.5"><Building2 size={16} /> @{company.username}</span>
                <a href={company.website} target="_blank" className="flex items-center gap-1.5 text-indigo-600 hover:underline">
                  <Globe size={16} /> {company.website?.replace("https://", "")} <ExternalLink size={14} />
                </a>
              </div>
            </div>
            
            {/* STATUS BADGES */}
            <div className="flex flex-col gap-2">
               {company.isApproved ? (
                 <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 size={18} /> Approved
                 </div>
               ) : (
                 <div className="bg-amber-50 text-amber-600 border border-amber-100 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-sm">
                    <Clock size={18} /> Pending Approval
                 </div>
               )}
               {company.isRejected && (
                 <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-sm">
                    <Ban size={18} /> Rejected
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: STATS & INFO */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Stats Chart */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Users size={20} className="text-indigo-600" /> Platform Activity
              </h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{fill: '#F8FAFC'}} 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={40}>
                      {statsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rejection Info (If exists) */}
            {company.isRejected && company.rejectionReason && (
              <div className="bg-rose-50 border border-rose-100 p-6 rounded-[32px]">
                <h3 className="text-rose-700 font-bold mb-2 flex items-center gap-2">
                  <Ban size={18} /> Rejection Reason
                </h3>
                <p className="text-rose-600/80 text-sm leading-relaxed">{company.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: INTERNSHIPS LIST */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Briefcase size={22} className="text-indigo-600" /> 
                  Active Internships ({company.internships?.length || 0})
                </h3>
              </div>

              <div className="space-y-4">
                {company.internships?.length > 0 ? (
                  company.internships.map((job: any) => (
                    <div key={job.id} className="group p-5 border border-slate-100 rounded-[24px] hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full flex items-center gap-1">
                              <MapPin size={12} /> {job.locationType === 0 ? "Remote" : "On-site"}
                            </span>
                            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-1">
                              <Building2 size={12} /> {job.departmentName}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Applications</span>
                           <span className="text-lg font-black text-indigo-600">{job.applicationCount}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                           <span className="flex items-center gap-1"><Calendar size={14} /> Deadline: {new Date(job.deadlineDate).toLocaleDateString()}</span>
                           <span className="flex items-center gap-1">
                             {job.isPaid ? (
                               <span className="text-emerald-600 font-bold">Paid Internship</span>
                             ) : (
                               "Unpaid"
                             )}
                           </span>
                        </div>
                        {job.isClosed ? (
                          <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">Closed</span>
                        ) : (
                          <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Active</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-[32px]">
                    No internships posted yet.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompanyPage;