"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SpaceDashboardOutlined,
  PostAddOutlined,
  ListAltOutlined,
  AnalyticsOutlined,
  AccountCircleOutlined,
} from "@mui/icons-material";
import { Menu, MessageSquareQuote, X, LogOut, CreditCard } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { name: "Dashboard", icon: <SpaceDashboardOutlined />, path: "/dashboard" },
  { name: "Post an Internship", icon: <PostAddOutlined />, path: "/dashboard/post" },
  { name: "Manage Listings", icon: <ListAltOutlined />, path: "/dashboard/listings" },
  { name: "Buy Premium", icon: <CreditCard size={22} />, path: "/dashboard/payment" },
  { 
    name: "Review", 
    icon: <MessageSquareQuote size={22} />, 
    path: "/dashboard/review" 
  },
  { name: "Company Profile", icon: <AccountCircleOutlined />, path: "/dashboard/profile" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section - Birinci sidebar ilə eyniləşdirildi */}
      <div className="pt-10 px-8 pb-12">
        <div className="flex items-center justify-between">
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
          {/* Mobile Close Button */}
          <button className="lg:hidden text-slate-400 p-2" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
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
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-50/50"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
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

      {/* Bottom Profile/Logout Section */}
      <div className="p-6 mt-auto border-t border-slate-50">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 font-black border border-blue-50">
            A
          </div>
          <div className="flex-grow overflow-hidden">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Company Panel</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-500 hover:text-rose-600 transition-all duration-200 font-bold group rounded-2xl hover:bg-rose-50"
        >
          <LogOut size={20} className="text-slate-400 group-hover:text-rose-500 group-hover:-translate-x-1 transition-all" />
          <span className="text-[14.5px]">Log out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 flex items-center justify-between z-[40]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white scale-75 rotate-[15deg]">
            <div className="w-2.5 h-2.5 bg-white rounded-sm" />
          </div>
          <span className="font-black text-slate-900 tracking-tight">CLP AI</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 bg-slate-50 rounded-xl text-slate-600 active:scale-95 transition-transform"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-[280px] h-screen bg-white border-r border-slate-100 flex-col fixed left-0 top-0 z-50">
        <SidebarContent />
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[50] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-[60] lg:hidden flex flex-col shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Spacer */}
      <div className="lg:ml-[280px] pt-16 lg:pt-0 min-h-screen bg-slate-50/30">
        {/* Page content loads here */}
      </div>
    </>
  );
};

export default Sidebar;