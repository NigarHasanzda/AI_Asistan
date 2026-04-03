"use client";

import React from 'react';
import { Bot, Mic, Briefcase, ChevronRight, Sparkle } from 'lucide-react';

const CoreFeature = () => {
  const features = [
    {
      title: "AI Career Mentor",
      description: "Get 24/7 personalized guidance on career paths, skill acquisition, and industry trends tailored to your unique background.",
      buttonText: "Start Chatting",
      icon: <Bot className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />,
      color: "blue"
    },
    {
      title: "AI Mock Interviews",
      description: "Practice with advanced LLM simulators. Get instant feedback on your tone, confidence, and technical content.",
      buttonText: "Try Simulator",
      icon: <Mic className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />,
      color: "indigo"
    },
    {
      title: "Elite Internship ",
      description: "A premium marketplace connecting vetted students with top-tier companies looking for interns and junior roles.",
      buttonText: "Browse Jobs",
      icon: <Briefcase className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />,
      color: "purple"
    },
  ];

  return (
    <section className="w-full py-24 px-6 bg-slate-50/50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-[0.2em]">
              <Sparkle className="w-4 h-4 fill-indigo-600" />
              Core Capabilities
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Superpowers.</span>
            </h2>
          </div>
          <p className="text-slate-500 text-lg max-w-sm">
            Everything you need to accelerate your professional journey and land your dream role.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {features.map((item, index) => (
            <div 
              key={index} 
              className="group relative bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(79,70,229,0.12)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon Container */}
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-all duration-500 shadow-sm">
                {item.icon}
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-slate-500 leading-relaxed mb-10 flex-grow">
                  {item.description}
                </p>

                {/* Styled Button */}
                <button className="relative w-full py-4 px-6 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-xl shadow-slate-200 hover:shadow-indigo-200">
                  {item.buttonText}
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CoreFeature;