"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Dashboard ilə başlayan bütün path-ları gizlət
  const hideHeader = pathname.startsWith("/dashboard") || pathname === "/login" || pathname === "/register" || pathname.startsWith("/register/") || pathname.startsWith("/login/")|| pathname.startsWith("/userdashboard") || pathname.startsWith("/userdashboard/") ||pathname.startsWith("/reset-password") || pathname.startsWith("/reset-password/") || pathname.startsWith("/password") || pathname.startsWith("/password/"); 

  if (hideHeader) return null;

  return <Header />;
}
