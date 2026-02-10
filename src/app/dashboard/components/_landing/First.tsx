import React from 'react';
import AddIcon from '@mui/icons-material/Add';

const FirstSection = () => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between py-8 px-4 bg-transparent">
      {/* Sol tərəf: Salamlama mətni */}
      <div className="text-left mb-6 md:mb-0">
        <h1 className="text-[32px] md:text-[36px] font-extrabold text-[#111827] leading-tight">
          Welcome back, TechCorp
        </h1>
        <p className="text-[#6B7280] text-[16px] mt-2 font-medium">
          Here&apos;s what&apos;s happening with your hiring pipeline today.
        </p>
      </div>

      {/* Sağ tərəf: Gradient Düymə */}
      <button className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6366F1] via-[#3B82F6] to-[#14B8A6] text-white font-bold rounded-2xl shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_15px_25px_-5px_rgba(99,102,241,0.5)] transition-all duration-300 active:scale-95">
        <AddIcon sx={{ fontSize: 20 }} className="font-bold" />
        <span className="text-[15px]">Post New Job</span>
      </button>
    </div>
  );
};

export default FirstSection;