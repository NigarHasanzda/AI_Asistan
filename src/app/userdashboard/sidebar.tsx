"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  GraduationCap, 
  Briefcase, 
  UserCircle, 
  LogOut 
} from "lucide-react";
import PsychologyIcon from '@mui/icons-material/Psychology';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Person2Icon from '@mui/icons-material/Person2';

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={23} />, path: "/userdashboard" },
  { name: "All Interviews ", icon: <PsychologyIcon sx={{fontSize: 23}} />, path: "/userdashboard/myinterviews" },
  { name: "Mock Interview", icon: <RecordVoiceOverIcon sx={{fontSize: 23}}  />, path: "/userdashboard/interviews" },
  { name: "Internship Hub", icon: <BusinessCenterIcon sx={{fontSize: 23}} />, path: "/userdashboard/internships" },
  { name: "Profile", icon: <Person2Icon sx={{fontSize: 23}} />, path: "/userdashboard/profile" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-[#F1F5F9] flex flex-col fixed left-0 top-0 z-50">
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
        <button className="w-full flex items-center gap-3.5 px-4 py-4 text-[#64748B] hover:text-[#EF4444] transition-all duration-200 font-semibold group rounded-xl hover:bg-red-50/50">
          <LogOut size={20} className="text-[#94A3B8] group-hover:text-[#EF4444] transition-colors" />
          <span className="text-[15px]">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;