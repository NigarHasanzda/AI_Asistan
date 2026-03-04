import React from 'react';
import { Users, FileText, Pencil, CalendarDays, Plus } from 'lucide-react';
import Link from 'next/link';

interface InternshipCardProps {
  title: string;
  applicants: number;
  progress: number;
}

const InternshipCard = ({ title, applicants, progress }: InternshipCardProps) => (
  <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="text-[18px] font-bold text-gray-900 mb-2">{title}</h3>
    <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
      <Users size={16} />
      <span>{applicants} Applicants</span>
    </div>
    
    {/* Progress Bar */}
    <div className="w-full bg-gray-50 h-[6px] rounded-full mb-8 relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 h-full bg-[#7C3AED] rounded-full" 
        style={{ width: `${progress}%` }}
      />
    </div>

    <div className="flex items-center gap-3">
      <button className="flex-1 py-2.5 border border-[#7C3AED] text-[#7C3AED] rounded-xl text-sm font-semibold hover:bg-[#F5F3FF] transition-colors">
        View Applicants
      </button>
      <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
        <Pencil size={20} />
      </button>
      <button className="p-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
        <CalendarDays size={20} />
      </button>
    </div>
  </div>
);

const ManageList = () => {
  const postings = [
    { title: "Software Engineering Intern", applicants: 48, progress: 80 },
    { title: "Product Marketing Intern", applicants: 48, progress: 85 },
    { title: "Graphic Design Intern", applicants: 48, progress: 90 },
    { title: "Data Analyst Intern", applicants: 48, progress: 80 },
    { title: "Backend Developer C# Intern", applicants: 48, progress: 85 },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 p-8 md:p-12 font-sans antialiased">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-[32px] font-bold text-gray-900 tracking-tight">My Internship Postings</h1>
          <p className="text-gray-400 mt-1 text-[16px]">Manage and track your internship postings.</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white border border-gray-100 rounded-[24px] p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Postings</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-[24px] p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-[#F5F3FF] rounded-xl flex items-center justify-center text-[#7C3AED]">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Applicants</p>
              <p className="text-2xl font-bold text-gray-900">245</p>
            </div>
          </div>
        </div>

        {/* Postings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postings.map((item, index) => (
            <InternshipCard key={index} {...item} />
          ))}

          {/* New Posting Dotted Card */}
          <button className="bg-[#F5F3FF]/50 border-2 border-dashed border-[#DDD6FE] rounded-[24px] p-8 flex flex-col items-center justify-center group hover:bg-[#F5F3FF] transition-all min-h-[220px]">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#7C3AED] shadow-sm mb-4 group-hover:scale-110 transition-transform">
              
              <Link href="/dashboard/post">
              <Plus size={28} strokeWidth={2.5} /></Link>
            </div>
            <h3 className="text-lg font-bold text-gray-900">New Posting</h3>
            <p className="text-sm text-gray-400">Create a new internship</p>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ManageList;