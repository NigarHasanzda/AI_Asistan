"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInterviewById } from "@/services/MockInterview";
import { 
  ChevronLeft, 
  Calendar, 
  Target, 
  Layers, 
  Zap, 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { Interview } from "@/types/interview";





const InterviewDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [interview, setInterview] = useState<Interview| null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchInterview = async () => {
      setLoading(true);
      try {
        const data = await getInterviewById(Number(id));
        setInterview(data);
      } catch (err: any) {
        setError(err.message || "Məlumat yüklənərkən xəta baş verdi");
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Analyzing Report...</p>
      </div>
    </div>
  );

  if (error) return <div className="p-10 text-red-500 text-center font-bold">{error}</div>;
  if (!interview) return <div className="p-10 text-center text-slate-400">Interview data not found.</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">

      <div className="max-w-[90%] mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Summary & Score */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 border border-white sticky top-8"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                {/* Score Circle */}
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <motion.circle 
                    cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                    strokeDasharray={440}
                    initial={{ strokeDashoffset: 440 }}
                    animate={{ strokeDashoffset: 440 - (440 * interview.averageScore) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-indigo-600"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-800">{interview.averageScore}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Score</span>
                </div>
              </div>

              <h1 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{interview.name}</h1>
              <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">
                <Target size={14} /> {interview.targetJobName}
              </div>

              <div className="w-full space-y-4 text-left">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Layers size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-600 tracking-tight">Level</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 uppercase">{interview.level}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Zap size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-600 tracking-tight">Format</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 uppercase">{interview.mode}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-600 tracking-tight">Date</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Questions & Feedback */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500 rounded-2xl">
                  <BarChart3 size={24} />
                </div>
                <h2 className="text-2xl font-black italic tracking-tight uppercase">Executive Summary</h2>
              </div>
              <p className="text-indigo-100 leading-relaxed font-medium italic text-lg">
                "{interview.finalFeedback}"
              </p>
            </div>
          </motion.div>

          {/* QUESTIONS LIST */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Detail Breakdown</h3>
            {interview.questions.map((q, index) => (
              <motion.div 
                key={q.order}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black flex-shrink-0 mt-1">
                      {q.order}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                        {q.questionText}
                      </h4>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</span>
                    <div className="flex items-center gap-1 text-emerald-600 font-black text-xl">
                      <Star size={16} className="fill-emerald-600" />
                      {q.score}/100
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                      <CheckCircle2 size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Your Answer</span>
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {q.answerText || "No response recorded."}
                    </p>
                  </div>

                  <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <div className="flex items-center gap-2 mb-3 text-indigo-400">
                      <MessageSquare size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">AI Feedback</span>
                    </div>
                    <p className="text-slate-600 font-semibold italic leading-relaxed">
                      {q.feedback || "Improvement feedback not available for this question."}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailPage;