"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import PsychologyIcon from '@mui/icons-material/Psychology';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Person2Icon from '@mui/icons-material/Person2';
import { Menu } from 'lucide-react';

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={23} />, path: "/userdashboard" },
  { name: "All Interviews", icon: <PsychologyIcon sx={{fontSize: 23}} />, path: "/userdashboard/myinterviews" },
  { name: "Mock Interview", icon: <RecordVoiceOverIcon sx={{fontSize: 23}}  />, path: "/userdashboard/interviews" },
  { name: "Internship Hub", icon: <BusinessCenterIcon sx={{fontSize: 23}} />, path: "/userdashboard/internships" },
    { name: "My Applications ", icon: <BusinessCenterIcon sx={{fontSize: 23}} />, path: "/userdashboard/myaplication" },
      { name: "Saved Internship", icon: <RecordVoiceOverIcon sx={{fontSize: 23}}  />, path: "/userdashboard/savedinternship" },
 { name: "LeaderBoard", icon: <LayoutDashboard size={23} />, path: "/userdashboard/leaderboard" },
      { name: "Profile", icon: <Person2Icon sx={{fontSize: 23}} />, path: "/userdashboard/profile" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          <Menu size={24} />
        </button>
      </div>

      <aside className={`fixed top-0 left-0 h-screen bg-white border-r border-[#F1F5F9] flex flex-col z-50 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:w-[260px] w-[260px]`}>
        
        {/* Logo Section */}
        <div className="pt-8 px-8 pb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2563EB] rotate-45 flex items-center justify-center rounded-[4px] shadow-sm shadow-blue-100">
              <div className="w-3 h-3 bg-white -rotate-45" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-[#0F172A] tracking-tight leading-none">Kord AI</h1>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mt-1.5">
                Career Development
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-[#EFF6FF] text-[#2563EB]"
                    : "text-[#636d7a] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
                onClick={() => setIsOpen(false)} // mobile click hides sidebar
              >
                <span className={`transition-colors ${isActive ? "text-[#2563EB]" : "text-[#636d7a] group-hover:text-[#64748B]"}`}>
                  {item.icon}
                </span>
                <span className={`text-[15px] font-semibold tracking-[-0.01em] ${isActive ? "text-[#2563EB]" : ""}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#F1F5F9]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-4 text-[#64748B] hover:text-[#EF4444] transition-all duration-200 font-semibold group rounded-xl hover:bg-red-50/50"
          >
            <LogOut size={20} className="text-[#94A3B8] group-hover:text-[#EF4444] transition-colors" />
            <span className="text-[15px]">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar open */}
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/20 z-40 md:hidden" />}
    </>
  );
};

export default Sidebar;