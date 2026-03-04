import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Applicant {
  id: number;
  name: string;
  matchScore: number;
  image: string;
}

const ApplicantRow = ({ name, matchScore, image }: Applicant) => {
  // Score rəngini dinamik təyin edək
  const scoreColor = matchScore >= 90 ? 'text-green-600 bg-green-50' : 'text-emerald-600 bg-emerald-50';

  return (
    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-full px-6 py-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Profil Şəkli (Placeholder) */}
        <div className="w-12 h-12 rounded-lg bg-[#1D3D33] flex items-center justify-center overflow-hidden">
          <img src={image} alt={name} className="w-8 h-8 opacity-80" />
        </div>
        
        <div className="flex items-center gap-3">
          <h3 className="text-[18px] font-bold text-[#2563EB]">{name}</h3>
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-tight uppercase ${scoreColor}`}>
            MATCH SCORE: {matchScore}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-6 py-2.5 border border-[#2563EB] text-[#2563EB] rounded-full text-[14px] font-semibold hover:bg-blue-50 transition-colors">
          Accept the Applicant
        </button>
        <button className="px-6 py-2.5 bg-[#2563EB] text-white rounded-full text-[14px] font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
          Reject the Applicant
        </button>
        <button className="ml-2 text-gray-300">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

const ViewApplicants = () => {
  const applicants: Applicant[] = [
    { id: 1, name: "Ulviyya Mammadova", matchScore: 98, image: "/api/placeholder/48/48" },
    { id: 2, name: "Narmin Suleymanova", matchScore: 85, image: "/api/placeholder/48/48" },
    { id: 3, name: "Nigar Hasanova", matchScore: 98, image: "/api/placeholder/48/48" },
    { id: 4, name: "Ramiz Gurbanli", matchScore: 67, image: "/api/placeholder/48/48" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 md:p-12 font-sans antialiased">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-[36px] font-extrabold text-[#0F172A] mb-2">View Applicants</h1>
          <h2 className="text-[32px] font-extrabold text-[#0F172A]">Backend Developer C# Intern</h2>
        </header>

        {/* Applicants List */}
        <div className="mt-8">
          {applicants.map((applicant) => (
            <ApplicantRow key={applicant.id} {...applicant} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewApplicants;