"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

// MUI Komponentləri
import { 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  Divider, 
  IconButton, 
  Tooltip 
} from "@mui/material";

// MUI İkonlar
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import SparklesIcon from '@mui/icons-material/AutoAwesome';

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // MUI Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(storedRole);
  }, []);

  // Smooth Scroll Funksiyası
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        // Əgər element səhifədə varsa (ana səhifədəyik)
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        setOpen(false);
      } else {
        // Əgər başqa səhifədəyiksə, ana səhifəyə həmin ID ilə yönləndir
        router.push(`/${href}`);
      }
    } else if (href === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setOpen(false);
    }
  };

  const getDashboardPath = () => {
    if (!role) return "/login";
    const normalizedRole = role.toLowerCase();
    if (normalizedRole === "admin") return "/admindashboard";
    if (normalizedRole === "student") return "/userdashboard";
    if (normalizedRole === "employer" || normalizedRole === "company") return "/dashboard";
    return "/login";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    handleMenuClose();
    router.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (isLoggedIn === null) return null;

  return (
    <>
      <header
        className={`w-full fixed top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3 border-b border-slate-100"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            
            {/* Logo */}
            <Link 
                href="/" 
                onClick={(e) => handleNavLinkClick(e, "/")}
                className="flex items-center gap-2 group transition-transform active:scale-95"
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
                <SparklesIcon className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                Kord<span className="text-indigo-600">Ai</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    pathname === link.href
                      
                    
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* User Action Area */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center">
                  <Tooltip title="Profil">
                    <IconButton
                      onClick={handleMenuClick}
                      size="small"
                      className="hover:bg-indigo-50 transition-colors"
                      aria-controls={menuOpen ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={menuOpen ? 'true' : undefined}
                    >
                      <Avatar 
                        sx={{ 
                          width: 42, 
                          height: 42, 
                          bgcolor: '#4f46e5',
                          fontWeight: '800',
                          fontSize: '0.9rem',
                          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
                          border: '2px solid white'
                        }}
                      >
                        {role?.charAt(0).toUpperCase() || "U"}
                      </Avatar>
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={menuOpen}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        mt: 1.5,
                        borderRadius: '20px',
                        minWidth: 200,
                        padding: '8px',
                        filter: 'drop-shadow(0px 10px 25px rgba(0,0,0,0.05))',
                        border: '1px solid #f1f5f9',
                        '&:before': {
                          content: '""', display: 'block', position: 'absolute',
                          top: 0, right: 14, width: 10, height: 10,
                          bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                        },
                      },
                    }}
                  >
                    <div className="px-4 py-3">
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-sm font-bold text-slate-900 truncate capitalize">{role}</p>
                    </div>
                    <Divider className="opacity-50" />
                    
                    <MenuItem onClick={() => router.push(getDashboardPath())} className="rounded-xl my-1 gap-3 py-2.5 font-bold text-slate-700 hover:bg-indigo-50">
                      <ListItemIcon><DashboardIcon fontSize="small" className="text-indigo-600" /></ListItemIcon>
                      Dashboard
                    </MenuItem>
                    
                    <MenuItem onClick={handleLogout} className="rounded-xl my-1 gap-3 py-2.5 font-bold text-red-500 hover:bg-red-50">
                      <ListItemIcon><LogoutIcon fontSize="small" className="text-red-500" /></ListItemIcon>
                      Çıxış yap
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                >
                  Daxil Ol <SparklesIcon className="w-4 h-4" />
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-indigo-50 transition-colors"
              >
                {open ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Full Screen) */}
      <div
        className={`fixed inset-0 w-full h-full bg-white z-[60] transition-all duration-500 ease-in-out ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        } md:hidden`}
      >
        <div className="flex justify-between items-center px-8 py-8">
           <span className="text-2xl font-black text-indigo-600">Naviqasiya</span>
           <IconButton onClick={() => setOpen(false)} className="bg-slate-100"><CloseIcon /></IconButton>
        </div>
        <nav className="flex flex-col items-center justify-center h-[70vh] gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavLinkClick(e, link.href)}
              className="text-4xl font-black text-slate-900 hover:text-indigo-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          
          <div className="w-full px-12 mt-4">
             {isLoggedIn ? (
               <button onClick={handleLogout} className="w-full py-5 bg-red-50 text-red-500 rounded-3xl font-black text-xl">
                 Çıxış yap
               </button>
             ) : (
               <button onClick={() => router.push("/login")} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-indigo-200">
                 Daxil Ol
               </button>
             )}
          </div>
        </nav>
      </div>

      {/* Header-in altındakı boşluğu qorumaq üçün */}
      <div className="h-4" />
    </>
  );
}