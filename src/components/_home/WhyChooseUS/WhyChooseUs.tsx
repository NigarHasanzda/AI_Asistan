import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Image from 'next/image';

const WhyChooseUs = () => {
  const points = [
    {
      title: "Personalized Roadmaps",
      description: "Every user gets a custom path based on their specific goals and current skill level."
    },
    {
      title: "Real-time Feedback",
      description: "No more waiting. Get instant CV scores and interview performance reports within seconds."
    },
    {
      title: "Match Score Tech",
      description: "Our proprietary algorithm matches candidates to roles with a 92% success rate."
    }
  ];

  return (
    <section className="w-full py-20 px-4 bg-white">
      <div className="max-w-[90%] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Sol tərəf: Vizual Görüntü */}
        <div className="w-full lg:w-1/2">
          <div className="relative bg-[#F1F5F9] p-2 md:p-8 rounded-[32px] overflow-hidden">
            {/* Şəkli buraya əlavə edə bilərsiniz, hələlik placeholder funksiyası daşıyan dizayn */}
            <div className="rounded-[20px] overflow-hidden shadow-2xl">
              <img 
                src="/image.png" // Şəklinizin yolunu buraya yazın
                alt="Kord AI Dashboard"
                className="w-full h-auto   object-cover"
              />
            </div>
          </div>
        </div>

        {/* Sağ tərəf: Mətn və Siyahı */}
        <div className="w-full lg:w-1/2 text-left">
          <h2 className="text-[36px] font-bold text-[#111827] mb-4">
            Why Choose Kord AI?
          </h2>
          <p className="text-[#4B5563] text-[16px] leading-relaxed mb-10">
            We don't just find jobs; we build careers through a systematic, data-driven approach.
          </p>

          <div className="space-y-8">
            {points.map((point, index) => (
              <div key={index} className="flex items-start gap-4 group">
                {/* İkon */}
                <div className="mt-1">
                  <CheckCircleIcon className="text-[#DBEAFE] group-hover:text-[#2563EB] transition-colors duration-300 text-[24px]" />
                </div>
                
                {/* Mətn */}
                <div>
                  <h4 className="text-[18px] font-bold text-[#111827] mb-1">
                    {point.title}
                  </h4>
                  <p className="text-[#6B7280] text-[15px] leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;