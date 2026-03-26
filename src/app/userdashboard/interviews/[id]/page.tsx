"use client";

import React, { useState, useEffect } from "react";
import { getInterviewById } from "@/services/MockInterview";
import api from "@/libs/api";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  BrainCircuit, 
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  order: number;
  questionText: string;
  answerText?: string | null;
  score?: number;
  feedback?: string | null;
}

interface Interview {
  id: number;
  name?: string;
  mode?: string;
  level?: string;
  role?: string;
  questions?: Question[];
  isCompleted?: boolean;
  averageScore?: number;
}

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const idFromUrl = params?.id as string;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    if (idFromUrl) loadInterview(Number(idFromUrl));
  }, [idFromUrl]);

  const loadInterview = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInterviewById(id);
      setInterview(data);
      setQuestions(data.questions || []);
    } catch (err: any) {
      setError(err.message || "Məlumat yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!interview || !questions.length || interview.isCompleted) return;
    const currentQuestion = questions[currentIndex];
    const answer = answers[currentQuestion.order];
    if (!answer?.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/MockInterviews/my-interviews/${interview.id}/submit-answer?questionOrder=${currentQuestion.order}`,
        `"${answer}"`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        router.push(`/userdashboard/interviews/${interview.id}/detail`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest animate-pulse">Session Loading...</p>
    </div>
  );

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans">
      {/* Soft Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-50 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-50 blur-[100px] rounded-full" />
      </div>

      {/* CLEAN TOP NAV */}
      <nav className="relative z-10 px-10 py-5 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Exit Session
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
            <BrainCircuit size={20} />
          </div>
          <span className="font-black text-slate-800 tracking-tight text-lg uppercase italic">
            {interview?.name || "AI Interview"}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <Clock size={14} className="text-indigo-500" /> Live Session
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-20">
        {error ? (
          <div className="bg-red-50 border border-red-100 p-8 rounded-[32px] text-red-600 text-center font-bold">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT: PROGRESS & STATUS (Now in a cleaner sidebar style) */}
            <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
              <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-xl shadow-slate-200/30">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Completion</h4>
                 <div className="relative w-32 h-32 mx-auto mb-8">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                      <motion.circle 
                        cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={364}
                        initial={{ strokeDashoffset: 364 }}
                        animate={{ strokeDashoffset: 364 - (364 * progress) / 100 }}
                        className="text-indigo-600"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-slate-800">{currentIndex + 1}/{questions.length}</span>
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    {questions.map((q, idx) => (
                        <div key={q.order} className="flex items-center gap-3">
                           <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                             idx < currentIndex ? 'bg-emerald-500 text-white' : 
                             idx === currentIndex ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300'
                           }`}>
                             {idx < currentIndex ? <Check size={14} strokeWidth={4} /> : <span className="text-[10px] font-black">{q.order}</span>}
                           </div>
                           <span className={`text-[11px] font-bold uppercase tracking-tight ${idx === currentIndex ? 'text-slate-900' : 'text-slate-400'}`}>
                             {idx === currentIndex ? 'Current' : idx < currentIndex ? 'Answered' : 'Upcoming'}
                           </span>
                        </div>
                    ))}
                 </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[40px] hidden lg:block">
                 <div className="flex items-center gap-2 mb-3">
                   <Zap size={16} className="text-indigo-600 fill-indigo-600" />
                   <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Efficiency Tip</span>
                 </div>
                 <p className="text-indigo-900/70 text-xs font-semibold leading-relaxed">
                   AI konkret texnologiyalar və metodologiyalar (məs. SOLID, Agile) haqqında danışmağınızı sevir.
                 </p>
              </div>
            </div>

            {/* RIGHT: QUESTION & INPUT AREA */}
            <div className="lg:col-span-9 order-1 lg:order-2">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-slate-100 p-10 md:p-14 rounded-[50px] shadow-2xl shadow-slate-200/40 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                     <Sparkles size={120} />
                  </div>

                  <div className="mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                      <Zap size={14} className="text-amber-400 fill-amber-400" /> AI Challenge
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-[1.2] tracking-tight">
                      {questions[currentIndex]?.questionText}
                    </h2>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-6">Your professional response</label>
                    <textarea
                      autoFocus
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[40px] p-8 md:p-10 min-h-[300px] outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-700 text-lg font-medium leading-relaxed resize-none shadow-inner"
                      placeholder="Buraya yazmağa başlayın..."
                      value={answers[questions[currentIndex]?.order] || ""}
                      onChange={(e) => setAnswers({ ...answers, [questions[currentIndex].order]: e.target.value })}
                    />
                  </div>

                  <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                     <div className="flex items-center gap-3 text-slate-400 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                        <CheckCircle2 size={18} className="text-emerald-500" />
                        <span className="text-xs font-bold italic tracking-tight">Auto-save active</span>
                     </div>
                     
                     <button
                        onClick={handleSubmitAnswer}
                        disabled={submitting || !(answers[questions[currentIndex]?.order] || "").trim()}
                        className="w-full md:w-auto flex items-center justify-center gap-4 bg-slate-900 text-white hover:bg-indigo-600 disabled:opacity-20 px-12 py-6 rounded-[30px] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-300 active:scale-95"
                      >
                        {submitting ? "Syncing Response..." : (
                           <>
                             {currentIndex === questions.length - 1 ? "Finalize & See Results" : "Submit Answer"}
                             <ChevronRight size={20} />
                           </>
                        )}
                      </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Page;