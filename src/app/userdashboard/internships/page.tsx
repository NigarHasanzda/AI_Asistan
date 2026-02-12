"use client";

import React, { useEffect } from 'react';
import { Search, MapPin, Building2, Banknote, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Internship {
  id: number;
  role: string;
  company: string;
  location: string;
  salary: string;
  aiMatch: number;
  logo: string;
  category: string;
}

const internships: Internship[] = [
  { id: 1, role: 'Backend Intern', company: 'TechFlow', location: 'Remote', salary: '$3,500 /mo', aiMatch: 98, logo: 'TF', category: 'Engineering' },
  { id: 2, role: 'Product Design Intern', company: 'Creatively', location: 'New York, NY', salary: '$4,200 /mo', aiMatch: 92, logo: 'C', category: 'Design' },
  { id: 3, role: 'Fullstack Engineering Intern', company: 'Notion', location: 'San Francisco', salary: '$5,000 /mo', aiMatch: 85, logo: 'N', category: 'Engineering' },
  { id: 4, role: 'UI/UX Design Intern', company: 'Figma', location: 'Remote', salary: 'Unpaid', aiMatch: 78, logo: 'F', category: 'Design' },
];

const InternshipHub = () => {
  const router = useRouter();
  const categories = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Data Science'];

  useEffect(() => {
    localStorage.setItem("internships", JSON.stringify(internships));
  }, []);

  const openDetail = (item: Internship) => {
    localStorage.setItem("selectedInternship", JSON.stringify(item));
    router.push(`/userdashboard/internships/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-2 font-sans">
      <div className="max-w-[100%] mx-auto">

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Internship Hub</h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search internships by role, company, or keywords..."
            className="w-full py-4 pl-12 pr-4 bg-white border border-slate-100 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat, index) => (
            <button
              key={cat}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                index === 0 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {internships.map((item) => (
            <div
              key={item.id}
              onClick={() => openDetail(item)}
              className="group cursor-pointer relative bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {item.logo}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-slate-900">{item.role}</h3>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.aiMatch >= 90 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      AI MATCH: {item.aiMatch}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-slate-500 text-sm">
                    <span className="flex items-center gap-1"><Building2 size={16}/> {item.company}</span>
                    <span className="flex items-center gap-1"><MapPin size={16}/> {item.location}</span>
                    <span className="flex items-center gap-1"><Banknote size={16}/> {item.salary}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                  Practice for this Role
                </button>

                <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-[0_4px_14px_rgba(37,99,235,0.39)] hover:bg-blue-700 transition-all">
                  Apply Now
                </button>

                <ChevronRight className="text-slate-300 ml-2 group-hover:text-slate-500" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default InternshipHub;
