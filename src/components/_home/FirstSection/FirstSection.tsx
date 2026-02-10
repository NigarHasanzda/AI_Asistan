import React from 'react';

const FirstSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-[#F3F4F6] flex items-center justify-center px-5 py-14 md:px-12 lg:px-24 font-sans">
      
      <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* SOL TEXT */}
        <div className="flex flex-col space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center mx-auto lg:mx-0 w-fit px-3 py-1 bg-[#DDE4FF] rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#3B82F6] mr-2"></div>
            <span className="text-[11px] font-bold text-[#3B82F6] tracking-widest uppercase">
              AI-Powered Career Growth
            </span>
          </div>

          <h1 className="text-[36px] sm:text-[48px] md:text-[60px] lg:text-[76px] font-[900] text-[#1A1D23] leading-[1.05] tracking-tight">
            Bridge the Gap <br />
            Between <br />
            Education and <br />
            Your <span className="text-[#1D4ED8]">Dream Career</span>
          </h1>

          <p className="text-[#6B7280] text-base sm:text-lg md:text-xl max-w-[560px] mx-auto lg:mx-0 leading-relaxed font-medium">
            AI-powered roadmaps, CV analysis, and mock interviews to 
            unlock your professional potential. Join the next generation 
            of industry leaders.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            
            <button className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 bg-[#104AF1] hover:bg-[#0d3cc5] text-white text-base md:text-lg font-bold rounded-xl transition-all shadow-xl shadow-blue-200">
              Start Your Journey
            </button>

            <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-4 md:px-8 md:py-5 bg-white hover:bg-gray-50 text-[#1A1D23] text-base md:text-lg font-bold rounded-xl transition-all border border-transparent shadow-sm">
              <div className="w-8 h-8 flex items-center justify-center bg-[#1A1D23] rounded-full">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                  <path d="M10 6L0 12V0L10 6Z" fill="white"/>
                </svg>
              </div>
              See How It Works
            </button>

          </div>
        </div>

        {/* SAĞ DASHBOARD */}
        <div className="relative scale-[0.95] sm:scale-100">

          <div className="bg-[#121820] rounded-[32px] md:rounded-[40px] p-4 sm:p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border-[10px] sm:border-[12px] border-[#1C252E] relative overflow-hidden">
            
            <div className="bg-[#0B1015] rounded-2xl w-full aspect-[4/3] p-4 sm:p-6 flex flex-col space-y-6">

              {/* TOP BAR */}
              <div className="flex justify-between items-center opacity-40">
                <div className="h-2 w-20 sm:w-24 bg-gray-500 rounded"></div>
                <div className="flex gap-2">
                  <div className="h-2 w-5 sm:w-6 bg-gray-500 rounded"></div>
                  <div className="h-2 w-5 sm:w-6 bg-gray-500 rounded"></div>
                </div>
              </div>

              {/* GRAPH */}
              <div className="flex-1 relative border-b border-gray-800/50">
                <svg className="w-full h-full" viewBox="0 0 400 150">
                  <path 
                    d="M0 120 Q 50 110, 80 80 T 150 70 T 220 40 T 300 60 T 400 30" 
                    stroke="#1E4ED8" strokeWidth="3" fill="none" opacity="0.8"
                  />
                  <path 
                    d="M0 120 Q 50 110, 80 80 T 150 70 T 220 40 T 300 60 T 400 30 V 150 H 0 Z" 
                    fill="url(#gradient)" opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1E4ED8" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute top-2 right-2 sm:right-4 w-16 sm:w-20 h-16 sm:h-20 rounded-full border-[5px] sm:border-[6px] border-[#1E4ED8] border-t-transparent flex items-center justify-center">
                   <span className="text-[10px] text-white font-bold">85%</span>
                </div>
              </div>

              {/* TABLE */}
              <div className="space-y-3 opacity-30">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="h-2 w-2/3 bg-gray-600 rounded"></div>
                    <div className="h-2 w-1/3 bg-[#1E4ED8] rounded-full"></div>
                  </div>
                ))}
              </div>

            </div>

            {/* NAV */}
            <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 flex gap-3">
              <button className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all">
                ‹
              </button>
              <button className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center bg-white hover:bg-gray-100 rounded-full text-black shadow-lg transition-all">
                ›
              </button>
            </div>

          </div>

          <div className="absolute -z-10 -top-20 -right-20 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-blue-500/10 blur-[120px] rounded-full"></div>

        </div>
      </div>
    </section>
  );
};

export default FirstSection;
