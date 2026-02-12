"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Building2, Banknote, Clock } from "lucide-react";

export default function InternshipDetail() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedInternship");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="bg-slate-50 min-h-screen p-6">

      {/* Header */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6 flex items-center gap-6">

        <div className="w-16 h-16 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl">
          {data.logo}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{data.role}</h1>
          <div className="text-slate-500 flex gap-3 mt-1 text-sm">
            <span className="flex items-center gap-1"><Building2 size={16}/> {data.company}</span>
            <span className="flex items-center gap-1"><MapPin size={16}/> {data.location}</span>
          </div>
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-bold mb-3">About the Role</h2>
            <p className="text-slate-600">
              This internship focuses on real-world engineering and scalable product development.
            </p>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-bold mb-3">Requirements</h2>
            <ul className="list-disc ml-5 text-slate-600 space-y-2">
              <li>Strong problem-solving skills</li>
              <li>Experience with JavaScript / Python</li>
              <li>Team communication skills</li>
            </ul>
          </div>

        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-5">

          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">{data.aiMatch}%</p>
            <p className="text-sm text-slate-500">AI Match Score</p>
          </div>

          <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
            Apply Now
          </button>

          <button className="w-full py-3 border border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50">
            Practice for this Role
          </button>

          <div className="border-t pt-4 text-sm text-slate-500 space-y-2">
            <p className="flex items-center gap-2"><MapPin size={14}/> {data.location}</p>
            <p className="flex items-center gap-2"><Banknote size={14}/> {data.salary}</p>
            <p className="flex items-center gap-2"><Clock size={14}/> Posted recently</p>
          </div>

        </div>

      </div>
    </div>
  );
}
 