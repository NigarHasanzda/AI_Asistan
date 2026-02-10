import React from 'react';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import HubIcon from '@mui/icons-material/Hub';

const FeaturesSection = () => {
  const cards = [
    {
      title: "Student Success",
      description: "Personalized learning paths designed to fill skill gaps and make you industry-ready in record time.",
      icon: <SchoolIcon className="text-[#1D4ED8] text-[32px]" />,
    },
    {
      title: "Employer Insights",
      description: "Data-driven recruitment tools to identify top talent based on actual performance and verified skills.",
      icon: <BusinessCenterIcon className="text-[#1D4ED8] text-[32px]" />,
    },
    {
      title: "Future Ready",
      description: "We bridge the gap between traditional academia and the rapidly evolving tech industry landscape.",
      icon: <HubIcon className="text-[#1D4ED8] text-[32px]" />,
    },
  ];

  return (
    <section className="w-full py-14 sm:py-20 px-4 bg-white font-sans">
      <div className="max-w-[90%] mx-auto text-center">
        
        <div className="mb-12 sm:mb-16">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#111827] max-w-3xl mx-auto leading-tight">
            Empowering both Students and Employers through cutting-edge AI technology
          </h2>
          <div className="w-12 h-[3px] bg-[#2563EB] mx-auto mt-6"></div>
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="bg-[#F3F4F6] p-8 sm:p-10 lg:p-12 rounded-[20px] text-left flex flex-col items-start transition-all duration-300 hover:shadow-sm"
            >
              <div className="mb-6">
                {card.icon}
              </div>

              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#111827] mb-4">
                {card.title}
              </h3>

              <p className="text-[#4B5563] text-[14px] sm:text-[15px] leading-[1.6] font-medium">
                {card.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
