"use client";

import React, { useState } from "react";
import { Check, Zap, Building2, GraduationCap, ArrowRight, ShieldCheck } from "lucide-react";

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<"candidate" | "company">("candidate");

  const plans = {
    candidate: [
      {
        name: "Starter",
        price: "0",
        description: "Perfect for students starting their career journey.",
        features: ["First 3 AI Interviews FREE", "Basic Performance Analytics", "Public Profile Visibility", "Community Support"],
        buttonText: "Start Free",
        highlight: false,
      },
      {
        name: "Pro Student",
        price: "19",
        description: "Unlimited practice to master every interview.",
        features: ["Unlimited AI Interviews", "Deep-Dive Behavioral Analysis", "Priority Feedback Loop", "Resume Optimization AI", "Hidden from Leaderboard option"],
        buttonText: "Go Unlimited",
        highlight: true,
      },
    ],
    company: [
      {
        name: "Free Tier",
        price: "0",
        description: "Explore the talent pool without commitments.",
        features: ["Browse Top Performers", "View Public Profiles", "No Job Postings allowed", "Basic Analytics"],
        buttonText: "Join as Viewer",
        highlight: false,
      },
      {
        name: "Enterprise",
        price: "99",
        description: "Unlock full recruitment power and AI screening.",
        features: ["Unlimited Job Postings", "AI-Powered Candidate Ranking", "Direct Contact with Talents", "Custom Interview Scenarios", "Verified Company Badge"],
        buttonText: "Get Started",
        highlight: true,
      },
    ],
  };

  return (
    <section id="pricing" className="py-24 px-6 relative overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-200/20 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Ready to scale your <span className="text-indigo-600">Future?</span>
          </h2>
          
          {/* Toggle Switch */}
          <div className="inline-flex p-1.5 bg-slate-200/50 backdrop-blur-md rounded-2xl border border-slate-200">
            <button
              onClick={() => setBillingCycle("candidate")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                billingCycle === "candidate" ? "bg-white text-indigo-600 shadow-lg" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <GraduationCap size={18} /> For Students
            </button>
            <button
              onClick={() => setBillingCycle("company")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                billingCycle === "company" ? "bg-white text-indigo-600 shadow-lg" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Building2 size={18} /> For Companies
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-wrap justify-center gap-8">
          {plans[billingCycle].map((plan, index) => (
            <div
              key={index}
              className={`relative w-full max-w-sm p-8 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 ${
                plan.highlight 
                ? "bg-slate-900 text-white shadow-[0_30px_60px_-15px_rgba(79,70,229,0.4)]" 
                : "bg-white border border-slate-200 text-slate-900 shadow-xl shadow-slate-100"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? "text-indigo-400" : "text-indigo-600"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black">${plan.price}</span>
                  <span className={`text-sm font-medium ${plan.highlight ? "text-slate-400" : "text-slate-500"}`}>/month</span>
                </div>
                <p className={`mt-4 text-sm leading-relaxed ${plan.highlight ? "text-slate-400" : "text-slate-500"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-3">
                    <div className={`mt-1 p-0.5 rounded-full ${plan.highlight ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  plan.highlight
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                }`}
              >
                {plan.buttonText} <ArrowRight size={16} />
              </button>

              {plan.price === "0" && (
                <p className="text-center mt-6 text-[10px] font-bold uppercase tracking-widest opacity-40 italic">
                  No credit card required
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Note */}

      </div>
    </section>
  );
};

export default PricingSection;