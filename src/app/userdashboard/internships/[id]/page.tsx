"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Building2, Banknote, Clock, Users, Share2, Bookmark, CheckCircle2 } from "lucide-react";

interface Internship {
  id: number;
  role: string;
  company: string;
  location: string;
  salary: string;
  aiMatch: number;
  logo: string;
  category: string;
  duration: string;
  postedAt: string;
  technicalScore: number;
  behavioralScore: number;
  applicantCount: number;
  tags: string[];
  requirements: {
    technical: string[];
    soft: string[];
  };
  aboutRole: string;
  aboutCompany: string;
}

export default function InternshipDetail() {
  const [data, setData] = useState<Internship | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedInternship");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) return <div className="p-10 text-slate-500 font-medium">Yüklənir...</div>;

  return (
    <div className=" min-h-screen  font-sans text-slate-900">
      
      {/* ÜST NAVİQASİYA (Opsional) */}
      <div className="max-w-[100%] mx-auto mb-6 text-sm text-slate-500">
        <span className="cursor-pointer hover:text-slate-800 flex items-center gap-1">
          ← Back to Hub
        </span>
      </div>

      <div className="max-w-[90%] mx-auto">
        {/* HEADER SECTION */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-8 mb-8 flex items-start justify-between">
          <div className="flex gap-6">
            <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
              {/* Şəkildəki profil şəkli təmsili */}
              <img src="/api/placeholder/80/80" alt="Company" className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">{data.role}</h1>
                <div className="flex gap-2">
                  <Share2 size={20} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                  <Bookmark size={20} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-slate-500 text-[15px]">
                <span className="text-blue-600 font-medium cursor-pointer">{data.company}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin size={16} /> {data.location}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={16} /> {data.duration}</span>
                <span>•</span>
                <span>Summer 2024</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* SOL TƏRƏF (MƏZMUN) */}
          <div className="md:col-span-2 space-y-10">
            
            {/* ABOUT THE ROLE */}
            <section>
              <h2 className="text-xl font-bold mb-4">About the Role</h2>
              <p className="text-slate-600 leading-[1.7] text-[16px]">
                {data.aboutRole}
              </p>
            </section>

            {/* REQUIREMENTS */}
            <section>
              <h2 className="text-xl font-bold mb-6">Requirements</h2>
              <div className="grid md:grid-cols-2 gap-10">
                {/* TECH */}
                <div>
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-slate-400 mb-4">Technical Skills</h3>
                  <ul className="space-y-4">
                    {data.requirements.technical.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 text-[15px]">
                        <CheckCircle2 size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* SOFT */}
                <div>
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-slate-400 mb-4">Soft Skills</h3>
                  <ul className="space-y-4">
                    {data.requirements.soft.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 text-[15px]">
                        <CheckCircle2 size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ABOUT THE COMPANY */}
            <div className="bg-[#f8fafc] rounded-2xl p-8 border border-slate-100">
              <h2 className="text-xl font-bold mb-4">About the Company</h2>
              <p className="text-slate-600 leading-relaxed text-[15px] mb-6">
                {data.aboutCompany}
              </p>
              <div className="flex gap-2">
                {data.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-500 text-xs rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}