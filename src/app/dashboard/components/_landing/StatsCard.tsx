import React from 'react';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

const stats = [
  {
    title: "Total Postings",
    value: "24",
    change: "+12% this month",
    icon: <WorkOutlineIcon className="text-[#6366F1]" />,
    progress: "w-[60%]"
  },
  {
    title: "Active Applications",
    value: "1,284",
    change: "+5% vs last week",
    icon: <PeopleAltOutlinedIcon className="text-[#6366F1]" />,
    progress: "w-[75%]"
  },
  {
    title: "AI-Shortlisted Candidates",
    value: "156",
    change: "+18% increase",
    icon: <AutoAwesomeOutlinedIcon className="text-[#6366F1]" />,
    progress: "w-[40%]"
  }
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* Üst Hissə: Başlıq və İkon */}
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#6B7280] text-[14px] font-medium uppercase tracking-wider">
              {stat.title}
            </span>
            <div className="w-10 h-10 bg-[#EEF2FF] rounded-xl flex items-center justify-center">
              {stat.icon}
            </div>
          </div>

          {/* Orta Hissə: Rəqəm və Faiz */}
          <div className="flex items-baseline gap-3 mb-6">
            <h2 className="text-[32px] font-bold text-[#111827]">
              {stat.value}
            </h2>
            <span className="text-[#10B981] text-[13px] font-bold">
              {stat.change}
            </span>
          </div>

          {/* Alt Hissə: Progress Bar (Bənövşəyi xətt) */}
          <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full bg-[#6366F1] ${stat.progress} rounded-full`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;