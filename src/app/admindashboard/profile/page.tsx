"use client";

import React, { useEffect, useState } from "react";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  KeyRound, 
  Settings, 
  Loader2, 
  Save, 
  Fingerprint 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getAdminProfile, updateAdminProfile } from "@/services/Admin/Profile";

const Page = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // info | edit

  const [form, setForm] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
  });

  const fetchProfile = async () => {
    try {
      const data = await getAdminProfile();
      setProfile(data);
      setForm((prev) => ({ ...prev, username: data.username }));
    } catch (err) {
      toast.error("Profil yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Profil yenilənir...");
    try {
      setUpdating(true);
      await updateAdminProfile(form);
      toast.success("Profil uğurla yeniləndi! ✅", { id: loadingToast });
      fetchProfile();
      setForm({ ...form, currentPassword: "", newPassword: "" });
      setActiveTab("info"); // Yeniləndikdən sonra geri qayıt
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Xəta baş verdi ❌", { id: loadingToast });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="max-w-[90%] mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Account Settings</h1>

        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">
            {profile?.fullName?.split(" ").map((n: string) => n[0]).join("") || "AD"}
          </div>
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">{profile?.fullName}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 font-medium">
              <ShieldCheck size={16} className="text-indigo-500" />
              <span className="text-sm uppercase tracking-wider">{profile?.role}</span>
            </div>
          </div>
        </div>

        {/* TABS CONTROLLER */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl mb-8">
          <button 
            onClick={() => setActiveTab("info")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'info' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <User size={18} /> Profile Details
          </button>
          <button 
            onClick={() => setActiveTab("edit")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Settings size={18} /> Update Account
          </button>
        </div>

        {/* TAB CONTENT: INFO */}
        {activeTab === "info" && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 space-y-6">
              <InfoRow icon={<Fingerprint />} label="Admin ID" value={profile?.id} />
              <InfoRow icon={<User />} label="Username" value={profile?.username} />
              <InfoRow icon={<Mail />} label="Email Address" value={profile?.email} />
            </div>
          </div>
        )}

        {/* TAB CONTENT: EDIT FORM */}
        {activeTab === "edit" && (
          <form onSubmit={handleUpdate} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 ml-1">Change Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={20} />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                <KeyRound size={18} className="text-amber-500" /> Password Security
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <input
                    type="password"
                    name="currentPassword"
                    placeholder="Current Password"
                    value={form.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {updating ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {updating ? "Processing..." : "Save All Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Helper Component for Info Rows
const InfoRow = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:text-indigo-500 transition-colors">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-lg font-semibold text-slate-800">{value || "N/A"}</p>
    </div>
  </div>
);

export default Page;