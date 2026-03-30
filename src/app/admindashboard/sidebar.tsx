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
  LogoutOutlined,
} from "@mui/icons-material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { Menu, X } from "lucide-react"; // Mobil menyu üçün
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { name: "Dashboard", icon: <SpaceDashboardOutlined />, path: "/admindashboard" },
  { name: "Students", icon: <AnalyticsOutlined />, path: "/admindashboard/students" },
  // { name: "Post an Internship", icon: <PostAddOutlined />, path: "/dashboard/post" },
  // { name: "Manage Listings", icon: <ListAltOutlined />, path: "/dashboard/listings" },

  // { name: "Company Profile", icon: <AccountCircleOutlined />, path: "/dashboard/profile" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Səhifə dəyişəndə mobil menyunu bağla
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);


    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };
  // Sidebar-ın daxili komponenti (təkrar istifadə üçün)
  const SidebarContent = () => (
    <>
      {/* Logo Hissəsi */}
      <div className="flex items-center justify-between px-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6366F1] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <RocketLaunchIcon />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">TechCorp</h1>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Admin</p>
          </div>
        </div>
        {/* Mobildə Bağlama Düyməsi */}
        <button className="lg:hidden text-gray-400 p-2" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>

      {/* Menyu Elementləri */}
      <nav className="flex-grow space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={`${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-900"}`}>
                {item.icon}
              </span>
              <span className="font-bold text-[15px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Alt Profil Hissəsi */}
      <div
       className="mt-auto border-t border-gray-100 pt-6">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 font-black border border-indigo-50">
            A
          </div>
          <div className="flex-grow overflow-hidden">
            <h4 className="text-sm font-bold text-gray-900 truncate">Admin User</h4>
            <button onClick={handleLogout} className="text-[11px] text-gray-400 hover:text-red-500 font-bold flex items-center gap-1 transition-colors uppercase tracking-tighter">
              <LogoutOutlined sx={{ fontSize: 12 }} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ── MOBİL HEADER (Yalnız telefonda görünür) ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 flex items-center justify-between z-[40]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#6366F1] rounded-xl flex items-center justify-center text-white scale-75">
            <RocketLaunchIcon sx={{ fontSize: 18 }} />
          </div>
          <span className="font-bold text-gray-900">TechCorp</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 bg-gray-50 rounded-xl text-gray-600 active:scale-95 transition-transform"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* ── MASAÜSTÜ SİDEBAR (Böyük ekranlarda həmişə görünür) ── */}
      <aside className="hidden lg:flex w-[280px] h-screen bg-white border-r border-gray-100 flex-col py-8 px-5 fixed left-0 top-0">
        <SidebarContent />
      </aside>

      {/* ── MOBİL DRAWER (Animasiyalı açılan menyu) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Arxa fon qaraltması (Overlay) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50] lg:hidden"
            />
            {/* Sidebar Paneli */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-[60] lg:hidden flex flex-col py-8 px-5 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Layout Content üçün boşluq (Əsas səhifə kodunda margin-left vermək lazımdır) */}
      <div className="lg:ml-[280px] pt-20 lg:pt-0 min-h-screen">
        {/* Səhifə məzmunu bura gələcək */}
      </div>
    </>
  );
};

export default Sidebar;