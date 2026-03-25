"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CreateStudentProfile,
  UploadStudentPhoto,
  CreateStudentSkill,
  CreateProject,
  CreateExperience,
} from "@/services/CreateStudent";
import { GetTargetJobs } from "@/services/TargetJob";
import { 
  User, Camera, Cpu, Briefcase, Layers, 
  ChevronRight, ChevronLeft, Rocket, Loader2 
} from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [loading, setLoading] = useState(false);

  // Form States
  const [fullname, setFullname] = useState("");
  const [targetJobId, setTargetJobId] = useState<number>(0);
  const [targetJobs, setTargetJobs] = useState<{ id: number; name: string }[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [skill, setSkill] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [projectSkills, setProjectSkills] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const jobs = await GetTargetJobs();
      setTargetJobs(jobs);
    };
    fetchJobs();
  }, []);

  const getToken = () => localStorage.getItem("token") || "";

  // Son addımda bütün məlumatları göndər
  const handleSubmitAll = async () => {
    const token = getToken();
    if (!token) return alert("Token yoxdur!");

    setLoading(true);
    try {
      await CreateStudentProfile({ fullname, targetJobId });
      if (photo) await UploadStudentPhoto(photo, token);
      if (skill) await CreateStudentSkill(skill, token);
      if (projectName) {
        const skillNames = projectSkills.split(",").map(s => s.trim()).filter(Boolean);
        await CreateProject({ name: projectName, description: projectDescription, projectUrl, skillNames }, token);
      }
      if (companyName) {
        await CreateExperience({ companyName, designation, startDate, endDate, description }, token);
      }

      alert("Bütün profil uğurla tamamlandı! 🚀");
      router.push("/"); // Uğurlu POST-dan sonra yönləndir
    } catch (err) {
      console.error(err);
      alert("Məlumatı yadda saxlayarkən xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleStepSubmit = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmitAll();
    }
  };

  const progressWidth = `${(step / totalSteps) * 100}%`;
  const inputStyle = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white";
  const labelStyle = "block text-sm font-semibold text-gray-600 mb-2 ml-1";

  return (
    <div className="min-h-screen bg-[#FDFCFE] flex flex-col items-center py-12 px-4 font-sans text-gray-800">
      <div className="w-full max-w-xl">
        
        {/* Progress Tracker */}
        <div className="mb-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
            Addım {step} / {totalSteps}
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Profilini Canlandır</h1>
          <div className="mt-6 h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(168,85,247,0.4)]" 
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* STEP CONTENT */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 p-8 md:p-12 relative overflow-hidden">

          {/* STEP 1: PROFILE */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-50 rounded-2xl text-purple-600"><User size={24} /></div>
                <h2 className="text-2xl font-bold">Salam! Səni tanıyaq</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelStyle}>Tam Adınız</label>
                  <input className={inputStyle} placeholder="Nigar Həsənzadə" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                </div>
                <div>
                  <label className={labelStyle}>Hədəf Vəzifə</label>
                  <select className={inputStyle} value={targetJobId || ""} onChange={(e) => setTargetJobId(Number(e.target.value))}>
                    <option value="">İstiqamət seçin</option>
                    {targetJobs.map((job) => <option key={job.id} value={job.id}>{job.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PHOTO */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-indigo-50 rounded-full text-indigo-600 mb-4"><Camera size={32} /></div>
                <h2 className="text-2xl font-bold">Vizualın Önəmlidir</h2>
                <p className="text-gray-500 text-sm mt-2">Peşəkar görünüş üçün təmiz bir şəkil seç.</p>
              </div>
              <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[2rem] p-12 bg-gray-50/50 hover:bg-white hover:border-indigo-400 transition-all cursor-pointer">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && setPhoto(e.target.files[0])} />
                <div className="bg-white p-5 rounded-full shadow-lg text-gray-400 group-hover:text-indigo-500 transition-colors">
                  <Camera size={40} />
                </div>
                <p className="mt-4 font-semibold text-gray-700">{photo ? photo.name : "Şəkli bura sürüklə"}</p>
              </div>
            </div>
          )}

          {/* STEP 3: SKILLS */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><Cpu size={24} /></div>
                <h2 className="text-2xl font-bold">Güclü Tərəflərin</h2>
              </div>
              <div>
                <label className={labelStyle}>Bacarıqlarınızı qeyd edin</label>
                <input className={inputStyle} placeholder="React, Next.js, Redux..." value={skill} onChange={(e) => setSkill(e.target.value)} />
                <p className="text-xs text-gray-400 mt-3 ml-1 italic">Məsələn: Frontend mütəxəssisliyi üçün əsas stack-iniz.</p>
              </div>
            </div>
          )}

          {/* STEP 4: PROJECT */}
          {step === 4 && (
            <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Layers size={24} /></div>
                <h2 className="text-2xl font-bold">Ən Yaxşı İşin</h2>
              </div>
              <input className={inputStyle} placeholder="Layihənin adı" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              <textarea className={`${inputStyle} h-24 resize-none`} placeholder="Bu layihədə nə etdin?" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
              <div className="grid grid-cols-1 gap-4">
                <input className={inputStyle} placeholder="Layihə linki" value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} />
                <input className={inputStyle} placeholder="Stack (React, CSS...)" value={projectSkills} onChange={(e) => setProjectSkills(e.target.value)} />
              </div>
            </div>
          )}

          {/* STEP 5: EXPERIENCE */}
          {step === 5 && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-50 rounded-2xl text-orange-600"><Briefcase size={24} /></div>
                <h2 className="text-2xl font-bold">Təcrübə Keçmişin</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input className={inputStyle} placeholder="Şirkət" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                <input className={inputStyle} placeholder="Vəzifə" value={designation} onChange={(e) => setDesignation(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-2 tracking-widest">Başlanğıc</label>
                  <input type="date" className={inputStyle} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-2 tracking-widest">Bitmə</label>
                  <input type="date" className={inputStyle} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              <textarea className={`${inputStyle} h-24 resize-none`} placeholder="Məsuliyyətləriniz..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              disabled={step === 1 || step === totalSteps || loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                step === 1 || step === totalSteps ? "opacity-0 invisible" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft size={20} /> Geri
            </button>

            <button
              type="button"
              onClick={handleStepSubmit}
              disabled={loading}
              className={`
                flex items-center gap-3 px-10 py-4 rounded-[1.5rem] font-bold text-white transition-all shadow-lg active:scale-95
                ${step === totalSteps 
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-200" 
                  : "bg-gray-900 hover:bg-black hover:shadow-gray-200"}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {loading ? (
                <Loader2 size={22} className="animate-spin" />
              ) : step === totalSteps ? (
                <>Tamamla <Rocket size={20} /></>
              ) : (
                <>İrəli <ChevronRight size={20} /></>
              )}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-400 text-xs font-medium uppercase tracking-[0.2em]">
          Bütün məlumatlar yalnız son addımda serverə göndərilir
        </p>
      </div>
    </div>
  );
};

export default Page;