import React from 'react';
import Image from 'next/image';
import ShareIcon from '@mui/icons-material/Share';
import LanguageIcon from '@mui/icons-material/Language';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

const Footer = () => {
  const footerLinks = {
    Platform: ["Roadmaps", "CV Analysis", "Interview Sim", "Pricing"],
    Company: ["About Us", "Careers", "Blog", "Contact"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"]
  };

  return (
    <footer className="w-full bg-white pt-20 pb-10 px-6 border-t border-gray-100 font-sans">
      <div className="max-w-[90%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#104AFB] rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45"></div>
              </div>
              <span className="text-[22px] font-bold text-[#111827]">Kord AI</span>
            </div>
            
            <p className="text-[#6B7280] text-[15px] leading-relaxed max-w-sm mb-8">
              The premium AI-driven career development platform for the next generation of professionals.
            </p>
            <div className="flex gap-4">
              {[ShareIcon, AlternateEmailIcon, LanguageIcon].map((Icon, idx) => (
                <div 
                  key={idx} 
                  className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#4B5563] hover:bg-[#104AFB] hover:text-white transition-all cursor-pointer"
                >
                  <Icon sx={{ fontSize: 20 }} />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-[#111827] font-bold text-[16px] mb-6">
                  {category}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-[#9CA3AF] hover:text-[#104AFB] text-[14px] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
        <div className="mt-20 pt-8 border-t border-gray-50 text-center">
          <p className="text-[#9CA3AF] text-sm">
            © {new Date().getFullYear()} Kord AI. Bütün hüquqlar qorunur.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;