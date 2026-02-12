"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";


export default function FooterWrapper() {
  const pathname = usePathname();

  const hideFooter = pathname.startsWith("/dashboard") || pathname === "/login" || pathname === "/register" || pathname.startsWith("/register/") || pathname.startsWith("/login/")|| pathname.startsWith("/userdashboard") || pathname.startsWith("/userdashboard/") ; 

  if (hideFooter) return null;

  return <Footer />;
}
