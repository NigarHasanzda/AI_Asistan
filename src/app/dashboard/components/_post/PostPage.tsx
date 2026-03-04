"use client";
import React, { useState } from 'react';
import { Calendar, ChevronDown, Home, Building2, GitBranch, Plus, X } from 'lucide-react';

const PostInternshipForm = () => {
  const [location, setLocation] = useState('Remote');
  const [isPaid, setIsPaid] = useState(false);
  const [skills, setSkills] = useState([
    'Figma', 'User Research', 'Prototyping', 'UI Design', 'Adobe Suite'
  ]);

  return (
    <div className="min-h-screen bg-gray-50/30 flex items-center justify-center p-4 antialiased font-sans">
      <div className="w-full max-w-[800px] bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 md:p-12">
        
        {/* Başlıq hissəsi */}
        <header className="mb-8">
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Post a New Internship</h1>
          <p className="text-gray-400 mt-1 text-[15px]">Fill in the basic details to start your posting.</p>
        </header>

        <div className="space-y-6">
          {/* Internship Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Internship Title</label>
            <div className="relative group">
              <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all cursor-pointer">
                <option>Select Internship Title</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Department & Location Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Department</label>
              <div className="relative">
                <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all cursor-pointer">
                  <option>Select Department</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Location Type</label>
              <div className="flex p-1 bg-white border border-gray-200 rounded-xl gap-1">
                {[
                  { id: 'Remote', icon: Home },
                  { id: 'On-site', icon: Building2 },
                  { id: 'Hybrid', icon: GitBranch }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setLocation(type.id)}
                    className={`flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      location === type.id 
                      ? 'bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]' 
                      : 'text-gray-500 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <type.icon size={16} />
                    {type.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Start Date</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="dd/mm/yyyy" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">End Date</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="dd/mm/yyyy" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Paid Internship Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Paid Internship</h3>
              <p className="text-xs text-gray-400">Turn on if this internship offers compensation</p>
            </div>
            <button 
              onClick={() => setIsPaid(!isPaid)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isPaid ? 'bg-purple-600' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isPaid ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Internship Description</label>
            <textarea 
              rows={5}
              placeholder="Outline the responsibilities, goals, and daily tasks for this internship..."
              className="w-full border border-gray-200 rounded-2xl px-4 py-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all resize-none"
            />
          </div>

          {/* Recommended Skills */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Recommended Skills</label>
            <p className="text-xs text-gray-400 mb-3">Add relevant skills to help candidates find your post.</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer
                    ${index < 2 ? 'bg-[#7C3AED] text-white' : 'bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]'}`}
                >
                  {skill}
                  <X size={14} className={index < 2 ? 'text-white/80' : 'text-[#7C3AED]/80'} />
                </span>
              ))}
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 transition-all">
                Add Custom <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-50">
            <button className="w-fit bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-3 px-10 rounded-xl transition-all shadow-md shadow-purple-200 active:scale-[0.98]">
              Post the Internship
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostInternshipForm;