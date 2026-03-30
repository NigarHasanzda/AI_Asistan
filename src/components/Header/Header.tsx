"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Scroll effekti
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu bağlanması və scroll kilidi
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  // LOCALSTORAGE-dan məlumatların götürülməsi
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role"); // Məsələn: "admin", "student", "employer"
    
    setIsLoggedIn(!!token);
    setRole(storedRole);
  }, []);

  // Yönləndirmə məntiqi
  const goToDashboard = () => {
    // Role yoxdursa login-ə at
    if (!role) {
      router.push("/login");
      return;
    }

    // Role dəyərini kiçik hərflərlə yoxlayırıq ki, xəta ehtimalı azalsın
    const normalizedRole = role.toLowerCase();

    switch (normalizedRole) {
      case "admin":
        router.push("/admindashboard");
        break;
      case "student":
        router.push("/userdashboard");
        break;
      case "employer":
      case "company": // Əgər bazada company kimi saxlanılırsa
        router.push("/dashboard");
        break;
      default:
        router.push("/login");
        break;
    }
  };

  // SSR uyğunsuzluğunun qarşısını almaq üçün
  if (isLoggedIn === null) return null;

  return (
    <>
      <header
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200"
            : "bg-white/80 backdrop-blur-sm border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold tracking-tight text-gray-900 transition-transform group-hover:scale-105">
                Kord<span className="text-blue-600">Ai</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Button */}
            <div className="hidden md:block">
              {isLoggedIn ? (
                <button
                  onClick={goToDashboard}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Get Started
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 md:hidden transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <nav className="px-4 py-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg text-base font-medium ${
                pathname === link.href ? "text-blue-600 bg-blue-50" : "text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <button
              onClick={goToDashboard}
              className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold"
            >
              {isLoggedIn ? "Dashboard" : "Get Started"}
            </button>
          </div>
        </nav>
      </div>

      <div className="h-16" />
    </>
  );
}