"use client";

import React from "react";
import { UserCheck, BookOpen, Code, CheckCircle } from "lucide-react";
import { Start } from "@mui/icons-material";

const StartPage = () => {
  const steps = [
    {
      id: 1,
      title: "Behavioral",
      description:
        "A conversation-based assessment focusing on soft skills, past experiences, and cultural alignment with the team.",
      icon: <UserCheck size={20} className="text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      id: 2,
      title: "Technical",
      description:
        "Deep dive into role-specific knowledge. Expect questions regarding architecture, best practices, and industry standards.",
      icon: <BookOpen size={20} className="text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      id: 3,
      title: "Coding",
      description:
        "An interactive environment where you'll solve algorithmic challenges or build a small feature in real-time.",
      icon: <Code size={20} className="text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      id: 4,
      title: "Results",
      description:
        "Immediately after completion, receive a summary of your session and insights into your performance metrics.",
      icon: <CheckCircle size={20} className="text-green-600" />,
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white rounded-xl shadow-md max-w-3xl w-full p-8">
        <span className="text-[10px] font-bold text-blue-600 uppercase mb-2 inline-block tracking-widest">
          Mixed Mode Interview
        </span>
        <h1 className="text-2xl md:text-3xl font-black mb-4">
          Ready for your Kord AI Interview?
        </h1>
        <p className="text-slate-600 mb-8 text-sm md:text-base">
          Welcome to your Mixed Mode interview session. We've designed this
          process to be comprehensive yet efficient. Please review the 4-step
          flow below before you start.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col gap-3 p-5 rounded-xl ${step.bg} hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/50">
                {step.icon}
              </div>
              <h3 className="font-bold text-sm md:text-base">{`${step.id}. ${step.title}`}</h3>
              <p className="text-slate-600 text-xs md:text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col text-slate-500 text-xs md:text-sm gap-2">
            <span className="flex items-center gap-2">
              <span className="text-[10px]">⏱️</span> Estimated time: 45 minutes
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[10px]">🎥</span> Camera and microphone required
            </span>
          </div>
          <button
            onClick={() => console.log("Interview started")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Start Interview
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">
          By clicking Start, you agree to our{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default StartPage;