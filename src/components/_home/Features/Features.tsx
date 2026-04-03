"use client";

import React from 'react';
import { GraduationCap, Briefcase, Zap, MoveRight } from 'lucide-react';

const FeaturesSection = () => {
  const cards = [
    {
      title: "Student Success",
      description: "Personalized AI learning paths designed to bridge skill gaps and make you industry-ready in record time.",
      icon: <GraduationCap className="w-6 h-6 text-indigo-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "Employer Insights",
      description: "Data-driven recruitment tools to identify top talent based on actual performance and verified skill sets.",
      icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-50",
    },
    {
      title: "Future Ready",
      description: "We bridge the gap between traditional academia and the rapidly evolving modern tech industry landscape.",
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      bg: "bg-purple-50",
    },
  ];

  return (
    <section id="features" className="w-full py-24 px-6 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Part */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
              Our Value
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1]">
              Empowering the Next Generation of <span className="text-indigo-600">Global Talent.</span>
            </h2>
          </div>
          <p className="text-slate-500 text-lg max-w-md lg:text-right">
            Advanced AI technology built to streamline recruitment and accelerate professional growth.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="group relative p-8 rounded-[32px] bg-white border border-slate-100 hover:border-indigo-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] overflow-hidden"
            >
              {/* Hover Decorative Element */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 ease-out" />

              <div className={`relative w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                {card.icon}
              </div>

              <div className="relative">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {card.title}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  {card.description}
                </p>
                
                <button className="flex items-center gap-2 text-indigo-600 font-bold text-sm group/btn">
                  Learn more 
                  <MoveRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats / Social Proof (Optional) */}
        <div className="mt-20 p-8 rounded-[40px] bg-slate-900 flex flex-wrap justify-around gap-8 items-center">
            <div className="text-center">
                <p className="text-3xl font-bold text-white">10k+</p>
                <p className="text-slate-400 text-sm">Students Active</p>
            </div>
            <div className="w-px h-10 bg-slate-800 hidden md:block"></div>
            <div className="text-center">
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-slate-400 text-sm">Partner Companies</p>
            </div>
            <div className="w-px h-10 bg-slate-800 hidden md:block"></div>
            <div className="text-center">
                <p className="text-3xl font-bold text-white">95%</p>
                <p className="text-slate-400 text-sm">Success Rate</p>
            </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;