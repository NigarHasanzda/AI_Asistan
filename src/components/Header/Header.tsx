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
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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

  const getDashboardPath = () => {
    if (!role) return "/login";
    const normalizedRole = role.toLowerCase();
    if (normalizedRole === "admin") return "/admindashboard";
    if (normalizedRole === "student") return "/userdashboard";
    if (normalizedRole === "employer" || normalizedRole === "company") return "/dashboard";
    return "/login";
  };

const handleLogout = () => {
    // 1. LocalStorage-dan məlumatları təmizləyirik
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    
    // 2. State-ləri dərhal yeniləyirik (vizual gecikmə olmasın deyə)
    setIsLoggedIn(false);
    setRole(null);
    handleMenuClose();
    
    // 3. Əsas səhifəyə yönləndiririk
    router.push("/");

    // 4. Bütün tətbiqi refresh edirik ki, auth provider-lər və state-lər sıfırlansın
    // setTimeout istifadə etmək router.push-un tamamlanmasına şərait yaradır
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  if (isLoggedIn === null) return null;

  return (
    <>
      <header
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 py-2"
            : "bg-white/80 backdrop-blur-sm border-b border-gray-100 py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                Kord<span className="text-indigo-600">Ai</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    pathname === link.href
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* User Action Area */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center">
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleMenuClick}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={menuOpen ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={menuOpen ? 'true' : undefined}
                    >
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: 'indigo.600',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          border: '2px solid white',
                          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
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
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                        mt: 1.5,
                        borderRadius: '16px',
                        width: '220px',
                        '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                        '&:before': {
                          content: '""', display: 'block', position: 'absolute',
                          top: 0, right: 14, width: 10, height: 10,
                          bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <div className="px-4 py-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900">{role}</p>
                    </div>
                    <Divider sx={{ my: 1 }} />
                    
                    <MenuItem onClick={() => router.push(getDashboardPath())} sx={{ fontSize: '14px', py: 1.5 }}>
                      <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                      Dashboard
                    </MenuItem>
                    
                    {/* <MenuItem onClick={() => router.push("/settings")} sx={{ fontSize: '14px', py: 1.5 }}>
                      <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                      Settings
                    </MenuItem> */}

                    <Divider sx={{ my: 1 }} />
                    
                    <MenuItem onClick={handleLogout} sx={{ fontSize: '14px', py: 1.5, color: '#ef4444' }}>
                      <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="hidden md:block px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Get Started
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {open ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-[60] transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-between items-center px-6 py-6 border-b">
           <span className="text-xl font-black">Menu</span>
           <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </div>
        <nav className="p-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-2xl font-bold text-slate-900"
            >
              {link.label}
            </Link>
          ))}
          <Divider sx={{ my: 4 }} />
          {isLoggedIn ? (
            <div className="space-y-4">
               <button onClick={() => {router.push(getDashboardPath()); setOpen(false);}} className="w-full py-4 text-left font-bold text-xl flex items-center gap-3">
                  <DashboardIcon /> Dashboard
               </button>
               <button onClick={handleLogout} className="w-full py-4 text-left font-bold text-xl text-red-500 flex items-center gap-3">
                  <LogoutIcon /> Logout
               </button>
            </div>
          ) : (
            <button onClick={() => router.push("/login")} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xl">
              Get Started
            </button>
          )}
        </nav>
      </div>

      <div className="h-16" />
    </>
  );
}