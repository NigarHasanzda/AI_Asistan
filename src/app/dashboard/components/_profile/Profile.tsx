import React from 'react';
import { Globe, MapPin, Mail, Phone, Edit3, ExternalLink, Briefcase, Users, Star } from 'lucide-react';

const CompanyProfile = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans antialiased">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header / Cover Area */}
        <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm mb-8">
          <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-500 w-full" />
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12">
              <div className="p-2 bg-white rounded-[24px] shadow-lg">
                <div className="w-24 h-24 bg-[#1D3D33] rounded-[18px] flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">AN</span>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#7C3AED] text-white rounded-full text-sm font-semibold hover:bg-purple-700 transition-all shadow-md shadow-purple-100">
                <Edit3 size={18} />
                Edit Profile
              </button>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Agro Natural LLC</h1>
                <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                  <Star size={14} fill="currentColor" /> VERIFIED
                </span>
              </div>
              <p className="text-gray-500 mt-2 max-w-2xl text-[15px] leading-relaxed">
                Leading the digital transformation in agricultural technology. We provide innovative solutions 
                for sustainable farming and smart supply chain management.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-50">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Globe size={18} />
                <a href="#" className="hover:text-purple-600 transition-colors">www.agronatural.com</a>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={18} />
                <span>Baku, Azerbaijan</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={18} />
                <span>hr@agronatural.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Contact */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Company Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-purple-600"><Briefcase size={20} /></div>
                    <span className="text-sm font-medium text-gray-600">Active Posts</span>
                  </div>
                  <span className="font-bold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-blue-600"><Users size={20} /></div>
                    <span className="text-sm font-medium text-gray-600">Total Hires</span>
                  </div>
                  <span className="font-bold text-gray-900">84</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-all group">
                  Company Guidelines
                  <ExternalLink size={16} className="text-gray-300 group-hover:text-purple-500" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-all group">
                  Terms of Service
                  <ExternalLink size={16} className="text-gray-300 group-hover:text-purple-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Internships */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold text-gray-900">Active Internships</h3>
              <button className="text-[#7C3AED] text-sm font-bold hover:underline">View All</button>
            </div>
            
            {[
              { title: "Software Engineering Intern", type: "Remote", apps: 48 },
              { title: "UI/UX Design Intern", type: "Hybrid", apps: 32 }
            ].map((job, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-[24px] p-6 flex items-center justify-between shadow-sm hover:border-purple-200 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-bold">
                    {job.title.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{job.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={12} /> {job.type}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Users size={12} /> {job.apps} Applicants
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 bg-gray-50 rounded-full text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <ExternalLink size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;