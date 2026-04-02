"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  LogOut, 
  MessageSquareQuote, 
  Briefcase, 
  ClipboardCheck, 
  BookmarkCheck,
  Trophy, 
  UserCircle,
  Menu,
  X,
  Sparkles,
  History,
  CreditCard,
  GraduationCap
} from "lucide-react";

const menuItems = [
  { 
    name: "Dashboard", 
    icon: <LayoutDashboard size={22} />, 
    path: "/userdashboard" 
  },
  { 
    name: "All Interviews", 
    icon: <History size={22} />, 
    path: "/userdashboard/myinterviews" 
  },
  { 
    name: "Mock Interview", 
    icon: <Sparkles size={22} />, 
    path: "/userdashboard/interviews" 
  },
  { 
    name: "Internship", 
    icon: <GraduationCap size={22} />, 
    path: "/userdashboard/internships" 
  },
  { 
    name: "My Applications", 
    icon: <ClipboardCheck size={22} />, 
    path: "/userdashboard/myaplication" 
  },
  { 
    name: "Saved Internship", 
    icon: <BookmarkCheck size={22} />, 
    path: "/userdashboard/savedinternship" 
  },
  { 
    name: "LeaderBoard", 
    icon: <Trophy size={22} />, 
    path: "/userdashboard/leaderboard" 
  },
  { 
    name: "Payment", 
    icon: <CreditCard size={22} />, 
    path: "/userdashboard/payment" 
  },
  { 
    name: "Review", 
    icon: <MessageSquareQuote size={22} />, // Ikon burada düzəldildi
    path: "/userdashboard/review" 
  },
  { 
    name: "Profile", 
    icon: <UserCircle size={22} />, 
    path: "/userdashboard/profile" 
  },
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
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-xl bg-white shadow-lg border border-slate-100 text-slate-600 active:scale-95 transition-all"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <aside className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-100 flex flex-col z-50 transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} md:translate-x-0 md:w-[280px] w-[280px]`}>
        
        {/* Logo Section */}
        <div className="pt-10 px-8 pb-12">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 bg-blue-600 rotate-[15deg] flex items-center justify-center rounded-xl shadow-lg shadow-blue-200 transition-transform hover:rotate-0">
              <div className="w-3.5 h-3.5 bg-white rounded-sm" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">CLP AI</h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1.5">
                Career Launch Pad
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-50/50"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
                )}
                
                <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                  {item.icon}
                </span>
                <span className={`text-[14.5px] font-bold tracking-tight ${isActive ? "text-blue-600" : ""}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-6 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-4 text-slate-500 hover:text-rose-600 transition-all duration-200 font-bold group rounded-2xl hover:bg-rose-50 border border-transparent hover:border-rose-100"
          >
            <LogOut size={20} className="text-slate-400 group-hover:text-rose-500 group-hover:-translate-x-1 transition-all" />
            <span className="text-[14.5px]">Sistemdən Çıx</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 md:hidden transition-opacity" 
        />
      )}
    </>
  );
};

export default Sidebar;