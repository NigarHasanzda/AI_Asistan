"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SpaceDashboardOutlined,
  PostAddOutlined,
  ListAltOutlined,
  AnalyticsOutlined,
  AccountCircleOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const menuItems = [
  { name: "Dashboard", icon: <SpaceDashboardOutlined />, path: "/dashboard" },
  { name: "Post an Internship", icon: <PostAddOutlined />, path: "/dashboard/post" },
  { name: "Manage Listings", icon: <ListAltOutlined />, path: "/dashboard/listings" },
  { name: "Applicant Analytics", icon: <AnalyticsOutlined />, path: "/dashboard/analytics" },
  { name: "Company Profile", icon: <AccountCircleOutlined />, path: "/dashboard/profile" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] h-screen bg-white border-r border-gray-100 flex flex-col py-8 px-4 fixed left-0 top-0">
      {/* Logo Hissəsi */}
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-10 h-10 bg-[#6366F1] rounded-2xl flex items-center justify-center text-white">
          <RocketLaunchIcon />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-none">TechCorp</h1>
          <p className="text-xs text-gray-500 mt-1">Enterprise Portal</p>
        </div>
      </div>

      {/* Menyu Elementləri */}
      <nav className="flex-grow space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? "bg-[#F3E8FF] text-[#7C3AED]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={`${isActive ? "text-[#7C3AED]" : "text-gray-400 group-hover:text-gray-900"}`}>
                {React.cloneElement(item.icon as React.ReactElement,)}
              </span>
              <span className="font-semibold text-[15px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Alt Profil Hissəsi */}
      <div className="mt-auto border-t border-gray-50 pt-6 px-2">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] font-bold">
            O
          </div>
          <div className="flex-grow">
            <h4 className="text-sm font-bold text-gray-900">Admin User</h4>
            <button className="text-[11px] text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors">
              <LogoutOutlined sx={{ fontSize: 12 }} />
              Log out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;