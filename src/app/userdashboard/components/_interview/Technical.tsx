"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, ChevronRight, Settings, Play, Terminal, MessageSquare, Clock, Layout } from "lucide-react";

const TechnicalInterview = () => {
  const stages = ["Introduction", "Theory Quiz", "Coding", "Wrap-up"];
  const middleTabs = ["Description", "Solutions", "Submissions"];

  const [activeStage, setActiveStage] = useState(2); // default Coding
  const [activeTab, setActiveTab] = useState(0);
  const [code, setCode] = useState("# Write your code here...");
  const [consoleLogs, setConsoleLogs] = useState([{ id: 1, text: "Test Case 1 Passed", passed: true }]);
  const [language, setLanguage] = useState("Python 3");

  const handleRun = () => {
    setConsoleLogs([
      ...consoleLogs,
      { id: consoleLogs.length + 1, text: `Test Case ${consoleLogs.length + 1} Passed`, passed: true }
    ]);
  };

  const handleSubmit = () => alert("Submit triggered:\n" + code);

  return (
    <div className="flex flex-col h-screen bg-white font-sans antialiased text-slate-900">
      
      {/* TOP NAV */}
      <header className="h-14 border-b border-slate-100 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white">
            <span className="text-[10px] font-black italic">K</span>
          </div>
          <span className="text-sm font-bold tracking-tight">
            KORD AI <span className="text-slate-300 font-normal ml-1">| INTERVIEW</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-slate-500 font-bold text-xs">
            <Layout size={14} /> Q 2 / 5
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg text-blue-600 font-bold text-xs">
            <Clock size={14} /> 25:14
          </div>
          <Settings size={18} className="text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* LEFT SIDEBAR - Stages */}
        <aside className="w-60 border-r border-slate-100 flex flex-col p-6 shrink-0 bg-white">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Interview Stages</h3>
          <nav className="flex-1 space-y-6">
            {stages.map((stage, idx) => {
              const isActive = idx === activeStage;
              const isCompleted = idx < activeStage;
              return (
                <div
                  key={stage}
                  onClick={() => setActiveStage(idx)}
                  className={`flex items-center gap-3 font-bold text-sm cursor-pointer ${
                    isCompleted ? "text-emerald-500" : isActive ? "text-blue-600 p-3 bg-blue-50 rounded-xl -ml-3" : "text-slate-400 font-medium"
                  }`}
                >
                  {isCompleted || isActive ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  {stage}
                </div>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-50">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Live Session
              </div>
            </div>
          </div>
        </aside>

        {/* MIDDLE - Problem / Tabs */}
        <main className="flex-1 flex flex-col overflow-y-auto border-r border-slate-100">
          {/* Tabs */}
          <div className="h-12 border-b border-slate-50 px-6 flex gap-8 shrink-0">
            {middleTabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`text-xs font-bold h-full border-b-2 transition-all ${
                  i === activeTab ? "border-blue-500 text-blue-600" : "border-transparent text-slate-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8 flex-1 overflow-auto">
            {activeTab === 0 && (
              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-4">
                  1. Two Sum Challenge
                </h1>
                <p className="text-sm text-slate-600 mb-4">
                  Given an array of integers <code className="bg-slate-100 px-1 rounded">nums</code> and an integer <code className="bg-slate-100 px-1 rounded">target</code>, return indices of the two numbers that add up to <code className="bg-slate-100 px-1 rounded">target</code>.
                </p>
              </div>
            )}
            {activeTab === 1 && (
              <textarea
                className="w-full h-96 p-4 font-mono text-sm border rounded-lg text-slate-700"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            )}
            {activeTab === 2 && (
              <div className="font-mono text-sm text-slate-700">
                {consoleLogs.map(log => (
                  <div key={log.id} className={`flex items-center gap-2 ${log.passed ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}`}>
                    {log.passed ? <CheckCircle2 size={14} /> : <Terminal size={14} />} {log.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* RIGHT - Editor + Console */}
        <section className="flex-[1.2] flex flex-col bg-[#1E293B] overflow-hidden">
          {/* Editor Header */}
          <div className="h-12 bg-[#0F172A] px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-4">
              <select
                className="bg-slate-800 text-slate-300 text-[11px] font-bold py-1 px-3 rounded border-none focus:ring-0"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>Python 3</option>
                <option>JavaScript</option>
                <option>Java</option>
              </select>
              <div className="h-4 w-[1px] bg-slate-700" />
              <button className="text-slate-400 hover:text-white transition-colors"><Terminal size={14} /></button>
            </div>
          </div>

          {/* Code Area */}
          <div className="flex-1 font-mono text-sm p-6 overflow-y-auto text-slate-300 relative">
            <div className="absolute left-0 top-0 w-10 h-full bg-[#0F172A]/50 flex flex-col items-center py-6 text-slate-600 text-[11px] select-none">
              {Array.from({ length: 20 }).map((_, i) => <div key={i}>{i+1}</div>)}
            </div>
            <textarea
              className="ml-8 w-full h-full bg-[#1E293B] text-slate-300 p-2 font-mono resize-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {/* Console & Actions */}
          <div className="h-1/3 bg-[#0F172A] border-t border-slate-800 flex flex-col">
            <div className="px-6 py-2 border-b border-slate-800 flex gap-6 shrink-0">
              <button className="text-[10px] font-bold text-white border-b-2 border-white pb-1 tracking-widest">CONSOLE</button>
              <button className="text-[10px] font-bold text-slate-500 pb-1 tracking-widest hover:text-slate-300 transition-colors">TEST RESULT</button>
            </div>
            <div className="flex-1 p-6 font-mono text-xs overflow-y-auto space-y-2">
              {consoleLogs.map(log => (
                <div key={log.id} className={`flex items-center gap-2 ${log.passed ? 'text-emerald-400 font-bold' : 'text-red-500 font-bold'}`}>
                  {log.passed ? <CheckCircle2 size={14} /> : <Terminal size={14} />} {log.text}
                </div>
              ))}
            </div>
            <div className="p-4 bg-[#1E293B] flex items-center justify-between border-t border-slate-800">
              <button onClick={handleRun} className="text-slate-400 flex items-center gap-2 text-xs font-bold hover:text-white">
                <Play size={14} /> Run
              </button>
              <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-all">
                Submit Answer <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default TechnicalInterview;