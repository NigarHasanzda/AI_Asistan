import React from 'react';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import WorkIcon from '@mui/icons-material/Work';

const CoreFeature = () => {
  const features = [
    {
      title: "AI Mentor",
      description: "24/7 AI-powered guidance on career paths, skill acquisition, and industry trends tailored to your background.",
      buttonText: "Learn More",
      icon: <SmartToyIcon className="text-[#1D4ED8]" />,
    },
    {
      title: "Mock Interviews",
      description: "Practice with our advanced LLM-based interview simulators. Receive instant feedback on your tone and content.",
      buttonText: "Practice Now",
      icon: <RecordVoiceOverIcon className="text-[#1D4ED8]" />,
    },
    {
      title: "Internship Hub",
      description: "A curated marketplace connecting vetted students with top-tier companies looking for interns and junior roles.",
      buttonText: "Browse Roles",
      icon: <WorkIcon className="text-[#1D4ED8]" />,
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 px-4 bg-[#F9FAFB]">
      <div className="max-w-[90%] mx-auto">
        
        {/* Başlıq */}
        <div className="mb-10 sm:mb-12 text-left">
          <h2 className="text-[26px] sm:text-[30px] md:text-[32px] font-bold text-[#000000] mb-2">
            Core Platform Features
          </h2>
          <p className="text-[#6B7280] text-[14px] sm:text-[16px]">
            Everything you need to accelerate your professional journey.
          </p>
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-full"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-[#EFF6FF] rounded-xl flex items-center justify-center mb-6">
                {item.icon}
              </div>

              <h3 className="text-[20px] sm:text-[22px] font-bold text-[#111827] mb-4">
                {item.title}
              </h3>
              
              <p className="text-[#4B5563] text-[14px] sm:text-[15px] leading-relaxed mb-8 flex-grow">
                {item.description}
              </p>

              {/* Button */}
              <button className="w-full py-3 px-4 bg-[#104AFB] hover:bg-blue-700 text-white font-bold rounded-xl transition-colors duration-200">
                {item.buttonText}
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CoreFeature;
