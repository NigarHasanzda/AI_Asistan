import React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Image from 'next/image';

const candidates = [
  {
    name: "Alex Rivera",
    role: "SOFTWARE ENGINEERING INTERN",
    match: "98% Match",
    school: "Stanford University • Class of 2025",
    image: "https://i.pravatar.cc/150?u=alex",
  },
  {
    name: "Sarah Chen",
    role: "PRODUCT DESIGN INTERN",
    match: "95% Match",
    school: "MIT • Class of 2024",
    image: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "Marcus Jordan",
    role: "DATA SCIENCE INTERN",
    match: "92% Match",
    school: "Georgia Tech • Class of 2025",
    image: "https://i.pravatar.cc/150?u=marcus",
  }
];

const SmartMatch = () => {
  return (
    <section className="w-full mt-8">
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        
        {/* Başlıq Hissəsi */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AutoAwesomeIcon className="text-[#6366F1] text-[20px]" />
              <h2 className="text-[22px] font-bold text-[#111827]">
                Smart Match - Top AI Recommendations
              </h2>
            </div>
            <p className="text-[#6B7280] text-[15px]">
              Our AI has identified these top candidates matching your active listings.
            </p>
          </div>
          
          <button className="flex items-center gap-1 text-[#6366F1] font-bold text-[14px] hover:underline transition-all">
            View all matches <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </button>
        </div>

        {/* Namizəd Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {candidates.map((person, index) => (
            <div 
              key={index} 
              className="bg-[#F9FAFB] rounded-[24px] p-8 flex flex-col items-center text-center border border-transparent hover:border-[#E5E7EB] transition-all group"
            >
              {/* Profil Şəkli və Match Badge */}
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden ring-2 ring-[#6366F1]/20 group-hover:ring-[#6366F1]/50 transition-all">
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#6366F1] text-white text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                  {person.match}
                </div>
              </div>

              {/* Namizəd Məlumatları */}
              <h3 className="text-[19px] font-bold text-[#111827] mb-1">
                {person.name}
              </h3>
              <p className="text-[#6366F1] text-[12px] font-extrabold tracking-wider mb-4 uppercase">
                {person.role}
              </p>
              <p className="text-[#6B7280] text-[14px] leading-relaxed font-medium">
                {person.school}
              </p>
            </div>
          ))}
        </div>

        {/* Vizual üçün sağ küncdəki zərif gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6366F1]/5 to-transparent rounded-full -mr-16 -mt-16 blur-2xl"></div>
      </div>
    </section>
  );
};

export default SmartMatch;