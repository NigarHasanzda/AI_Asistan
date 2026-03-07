"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Settings,
  Code2,
  Users2,
  Layers,
  Play,
  Info,
  ChevronDown,
} from "lucide-react";

const NewInterview = () => {
  const router = useRouter();

  const [mode, setMode] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Junior");
  const [role, setRole] = useState("Python Software Engineer");

  const modes = [
    {
      id: "Technical",
      icon: Code2,
      title: "Technical",
      desc: "Data structures, algorithms, and system design questions.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: "Behavioral",
      icon: Users2,
      title: "Behavioral",
      desc: "Soft skills, past experiences, and cultural fit scenarios.",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      id: "Mixed",
      icon: Layers,
      title: "Mixed Simulation",
      desc: "A balanced mix of technical challenges and behavioral prompts.",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const handleLaunch = () => {
    let path = "/";

    if (mode === "Technical") path = "interviews/technical";
    if (mode === "Behavioral") path = "interviews/behavioral";
    if (mode === "Mixed") path = "interviews/mixed";

    const query = `?level=${difficulty}&role=${encodeURIComponent(role)}`;

    router.push(path );
  };

  return (
    <div className="flex h-screen bg-white font-sans antialiased">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r border-gray-100 flex flex-col p-6">
        <div className="flex-1">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">
            Recent Performance
          </h3>

          <div className="space-y-4">
            {[
              {
                label: "Python Jr. Dev",
                date: "Feb 5",
                score: "82%",
                color: "bg-green-100 text-green-700",
              },
              {
                label: "Behavioral Check",
                date: "Feb 2",
                score: "74%",
                color: "bg-orange-100 text-orange-700",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                    <Code2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-gray-400">{item.date}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-md ${item.color}`}
                >
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-[40px] font-black text-[#0F172A] mb-2 tracking-tight">
              Start a New Simulation
            </h1>
            <p className="text-gray-400 text-lg">
              Configure your interview parameters to begin your AI-powered
              session.
            </p>
          </div>

          {/* 1. MODE */}
          <section className="mb-12">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
              1. Choose Interview Mode
            </h3>

            <div className="grid grid-cols-3 gap-6">
              {modes.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`relative p-8 rounded-[24px] border-2 transition-all cursor-pointer flex flex-col items-center text-center group ${
                    mode === m.id
                      ? "border-blue-500 bg-white shadow-xl shadow-blue-50"
                      : "border-gray-100 hover:border-gray-200 bg-white"
                  }`}
                >
                  {mode === m.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}

                  <div
                    className={`w-14 h-14 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
                  >
                    <m.icon size={28} />
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {m.title}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Difficulty & Role */}
          <div className="grid grid-cols-2 gap-12 mb-16">
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                2. Interview Difficulty
              </h3>

              <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1">
                {["Intern", "Junior", "Middle"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                      difficulty === d
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </section>

           
          </div>

          {/* Launch */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleLaunch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-[20px] font-bold text-xl flex items-center gap-3 shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Play size={18} fill="white" className="ml-1" />
              </div>
              Launch Interview
            </button>

            <p className="mt-6 flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wider">
              <Info size={14} /> Setup takes less than a minute. AI will
              initialize after launch.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewInterview;