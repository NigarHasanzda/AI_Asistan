"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  LogOut,
  Clock,
  ArrowRight,
  Mic,
  Paperclip,
  Zap,
} from "lucide-react";

const BehaviorlaMode = () => {
  const router = useRouter();

  const steps = ["Situation", "Task", "Action", "Result"];
  const [currentStepIndex, setCurrentStepIndex] = useState(1); // Active step
  const [inputTexts, setInputTexts] = useState<string[]>(["", "", "", ""]);

  // Step navigation
  const handleNextQuestion = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      router.push(`behavioral`);
    } else {
      alert("Behavioral interview finished!");
      // router.push("/behavioral/summary");
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    router.push(`behavioral`);
  };

  const handleInputChange = (value: string) => {
    const newTexts = [...inputTexts];
    newTexts[currentStepIndex] = value;
    setInputTexts(newTexts);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* LEFT SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-8">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tight">Kord AI</span>
        </div>

        <nav className="flex-1 space-y-8">
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Behavioral Steps</h3>
            <ul className="space-y-6">
              {steps.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isCompleted = idx < currentStepIndex;
                return (
                  <li
                    key={step}
                    onClick={() => handleStepClick(idx)}
                    className={`flex items-center gap-3 font-bold text-sm cursor-pointer ${
                      isCompleted
                        ? "text-emerald-500"
                        : isActive
                        ? "text-purple-600 p-3 bg-purple-50 rounded-xl -ml-3"
                        : "text-slate-400 font-medium"
                    }`}
                  >
                    {isCompleted || isActive ? <PlayCircle size={20} /> : <Circle size={20} />}
                    {step}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <button className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">
          <LogOut size={18} /> End Session
        </button>
      </aside>

      {/* CENTER */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-white border-r border-slate-50">
        <header className="h-16 px-8 flex items-center justify-between border-b border-slate-50 shrink-0">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            In Progress: Behavioral Mode
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-600 font-bold text-sm">
              <Clock size={16} /> 12:45
            </div>
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100"
            >
              Next Question <ArrowRight size={16} />
            </button>
          </div>
        </header>

        <div className="p-12 max-w-2xl">
          <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-md text-[10px] font-black uppercase tracking-tighter mb-6 inline-block">
            Active Question
          </span>
          <h1 className="text-3xl font-black text-slate-900 leading-tight mb-12">
            Tell me about a time you had a disagreement with a team member. How did you resolve it?
          </h1>

          {/* STAR Cards */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            {steps.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isCompleted = idx < currentStepIndex;
              const bg = isCompleted
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                : isCurrent
                ? "bg-purple-50 text-purple-600"
                : "bg-white border-2 border-slate-50 text-slate-400";
              return (
                <div key={step} className={`p-6 rounded-2xl ${bg}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{step}</span>
                    {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </div>
                  <p className="text-xs font-medium leading-relaxed">
                    {inputTexts[idx] || (isCurrent ? "Waiting for your response..." : "Not started yet.")}
                  </p>
                </div>
              );
            })}
          </div>

          {/* STAR Guidance */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="flex items-center gap-2 text-slate-400 mb-2 font-bold text-[10px] uppercase tracking-widest">
              <Zap size={14} fill="currentColor" /> Star Guidance
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              "Try to elaborate more on the specific <strong>Action</strong> you took to resolve the conflict. Focus on your personal contribution to the solution."
            </p>
          </div>
        </div>
      </main>

      {/* RIGHT - Chat / Input */}
      <section className="w-[450px] flex flex-col bg-[#F1F5F9]/30">
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* AI Message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Zap size={16} fill="currentColor" />
            </div>
            <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kord AI</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Describe the specific <strong>{steps[currentStepIndex]}</strong> for the situation.
              </p>
            </div>
          </div>

          {/* User Input Preview */}
          {inputTexts[currentStepIndex] && (
            <div className="flex flex-col items-end gap-2">
              <div className="bg-blue-600 p-5 rounded-2xl rounded-tr-none shadow-lg shadow-blue-100 text-white text-sm leading-relaxed max-w-[85%]">
                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest text-right">
                  Candidate
                </p>
                {inputTexts[currentStepIndex]}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 pt-0">
          <div className="bg-white border border-slate-100 rounded-2xl p-2 flex items-center gap-2 shadow-xl shadow-slate-200/50">
            <input
              type="text"
              placeholder="Type your response or click the mic to speak..."
              value={inputTexts[currentStepIndex]}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-2 placeholder:text-slate-400"
            />
            <button className="p-2 text-slate-300 hover:text-slate-500">
              <Paperclip size={20} />
            </button>
            <button className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 hover:bg-blue-700">
              <Mic size={20} />
            </button>
          </div>
          <p className="text-[9px] font-bold text-slate-400 text-center mt-4 uppercase tracking-widest">
            Tip: Speak clearly. Kord AI is listening for action and result details.
          </p>
        </div>
      </section>
    </div>
  );
};

export default BehaviorlaMode;