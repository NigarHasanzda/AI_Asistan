"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Dashboard ilə başlayan bütün path-ları gizlət
  const hideHeader = pathname.startsWith("/dashboard");

  if (hideHeader) return null;

  return <Header />;
}
