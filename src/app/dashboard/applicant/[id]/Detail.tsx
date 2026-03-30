"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ChevronLeft, Sparkles, Calendar, Briefcase, Star, AlertCircle } from "lucide-react";
import { getApplicationById } from "@/services/Apply";

interface Skill {
  id: number;
  name: string;
}

interface Experience {
  id: number;
  companyName: string;
  designation: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  projectUrl: string;
  skills: Skill[];
}

interface Application {
  applicationId: number;
  fullName: string;
  applicationStatus: string;
  companyName: string;
  createdAt: string;
  internshipTitle: string;
  matchScore: number;
  interviewAverageScore: number;
  aiMatchFeedback: string;
  rejectionReason: string | null;
  targetJob: string;
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  photoUrl?: string;
}

// ── helpers ────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function statusStyle(status: string) {
  const s = status?.toLowerCase();
  if (s === "accepted" || s === "approved")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "rejected")
    return "bg-red-50 text-red-700 border-red-200";
  if (s === "pending")
    return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

// ── Gauge dial (SVG) ────────────────────────────────────────────────────────
function GaugeDial({ value }: { value: number }) {
  const clamp = Math.min(100, Math.max(0, value));
  const radius = 72;
  const cx = 80, cy = 88;
  const arcLength = Math.PI * radius; 
  const filled = (clamp / 100) * arcLength;
  const dashOffset = arcLength - filled;

  const d = `M ${cx - radius},${cy} A ${radius},${radius} 0 0,1 ${cx + radius},${cy}`;

  return (
    <svg width="160" height="100" viewBox="0 0 160 100" className="overflow-visible">
      <defs>
        <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="#e0e7ff" strokeWidth="12" strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke="url(#dg)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={arcLength}
        strokeDashoffset={dashOffset}
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <circle cx={cx} cy={cy} r="5" fill="#6366f1" />
      <circle cx={cx} cy={cy} r="2.5" fill="white" />
      <text x="12" y="100" fontSize="10" fill="#94a3b8" textAnchor="middle">0</text>
      <text x="148" y="100" fontSize="10" fill="#94a3b8" textAnchor="middle">100</text>
    </svg>
  );
}

// ── Mini bar ────────────────────────────────────────────────────────────────
function ScoreBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold w-7 text-right" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
const ApplicationDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [data, setData] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await getApplicationById(id);
        setData(res);
        setImgSrc(
          res?.photoUrl
            ? res.photoUrl
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(res.fullName)}`
        );
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-400" size={36} />
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-center mt-16 text-slate-400">Data not found</p>
    );
  }

  const matchScore = data.matchScore ?? 0;
  const interviewScore = data.interviewAverageScore ?? 0;
  const skillsFit = Math.min(100, Math.round((data.skills.length / 8) * 100 + 20));

  return (
    <div className="min-h-screen bg-slate-50 px-4 ">
      <div className="max-w-[100%] mx-auto space-y-4">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 bg-white border border-slate-200 rounded-full px-4 py-1.5 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={14} />
          Back
        </button>

        {/* ── PROFILE ── */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              {data.photoUrl ? (
                <img
                  src={imgSrc}
                  onError={() =>
                    setImgSrc(
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}`
                    )
                  }
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-100"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-semibold text-lg ring-2 ring-white shadow-sm">
                  {getInitials(data.fullName)}
                </div>
              )}
              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-slate-800 truncate">{data.fullName}</h2>
              <p className="text-sm text-slate-400 mb-2.5">{data.companyName}</p>
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyle(data.applicationStatus)}`}>
                  {data.applicationStatus}
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {data.internshipTitle}
                </span>
                {data.targetJob && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                    → {data.targetJob}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  <Calendar size={11} />
                  {data.createdAt}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SCORE + DETAILS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Match Score Gauge */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">
              Matching Indicators
            </p>
            <div className="flex flex-col items-center mb-1">
              <GaugeDial value={matchScore} />
              <span className="text-2xl font-bold text-indigo-600 -mt-2">{matchScore}%</span>
              <span className="text-xs text-slate-400 mt-0.5">Overall match</span>
            </div>
            <div className="space-y-2.5 mt-4">
              <ScoreBar
                label="Match score"
                value={matchScore}
                color="linear-gradient(90deg,#a78bfa,#6366f1)"
              />
              <ScoreBar
                label="Interview"
                value={interviewScore || 0}
                color="linear-gradient(90deg,#67e8f9,#06b6d4)"
              />
              <ScoreBar
                label="Skills fit"
                value={skillsFit}
                color="linear-gradient(90deg,#86efac,#22c55e)"
              />
            </div>
          </div>

          {/* Detail fields */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Details
            </p>
            {[
              { key: "Internship position", val: data.internshipTitle },
              { key: "Target job", val: data.targetJob },
              { key: "Company", val: data.companyName },
              {
                key: "Interview score",
                val: interviewScore ? `${interviewScore} / 100` : "—",
                accent: !!interviewScore,
              },
            ].map(({ key, val, accent }) => (
              <div key={key}>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">{key}</p>
                <p className={`text-sm font-semibold ${accent ? "text-cyan-600" : "text-slate-700"}`}>
                  {val || "—"}
                </p>
              </div>
            ))}

            {data.rejectionReason && (
              <div className="flex gap-2 bg-red-50 border border-red-100 rounded-xl p-3 mt-2">
                <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-red-600 leading-relaxed">{data.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── SKILLS ── */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-indigo-400" />
            <span className="text-sm font-semibold text-slate-700">Skills</span>
            <span className="ml-auto text-xs bg-slate-100 text-slate-400 rounded-full px-2.5 py-0.5">
              {data.skills.length}
            </span>
          </div>
          {data.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => (
                <span
                  key={s.id}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100"
                >
                  {s.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No skills added</p>
          )}
        </div>

        {/* ── AI FEEDBACK ── */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-sm font-semibold text-slate-700">AI Feedback</span>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
              <span className="text-xs font-semibold tracking-widest text-violet-500 uppercase">
                Generated by AI
              </span>
            </div>
            <p className="text-sm text-violet-900 leading-relaxed">
              {data.aiMatchFeedback || "Feedback not available."}
            </p>
          </div>
        </div>

        {/* ── EXPERIENCES ── */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={14} className="text-emerald-500" />
            <span className="text-sm font-semibold text-slate-700">Experiences</span>
            <span className="ml-auto text-xs bg-slate-100 text-slate-400 rounded-full px-2.5 py-0.5">
              {data.experiences.length}
            </span>
          </div>
          {data.experiences.length > 0 ? (
            <div className="space-y-4">
              {data.experiences.map((exp) => (
                <div key={exp.id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Briefcase size={15} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{exp.designation}</p>
                    <p className="text-xs text-slate-400 mb-2">{exp.companyName}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 mb-2.5">
                      <Calendar size={10} />
                      {new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      {" — "}
                      {new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                    <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No experience added</p>
          )}
        </div>

        {/* ── PROJECTS ── */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#7c3aed" strokeWidth="1.5" className="shrink-0">
              <rect x="2" y="2" width="12" height="12" rx="3"/>
              <line x1="5" y1="8" x2="11" y2="8"/>
              <line x1="5" y1="5.5" x2="9" y2="5.5"/>
              <line x1="5" y1="10.5" x2="8" y2="10.5"/>
            </svg>
            <span className="text-sm font-semibold text-slate-700">Projects</span>
            <span className="ml-auto text-xs bg-slate-100 text-slate-400 rounded-full px-2.5 py-0.5">
              {data.projects.length}
            </span>
          </div>
          {data.projects.length > 0 ? (
            <div className="space-y-4">
              {data.projects.map((proj) => (
                <div key={proj.id} className="border border-slate-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#7c3aed" strokeWidth="1.5">
                        <rect x="2" y="2" width="12" height="12" rx="3"/>
                        <line x1="5" y1="8" x2="11" y2="8"/>
                        <line x1="5" y1="5.5" x2="9" y2="5.5"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{proj.name}</p>
                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-purple-600 hover:underline mt-0.5"
                        >
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3"/>
                            <path d="M10 2h4v4"/><line x1="14" y1="2" x2="8" y2="8"/>
                          </svg>
                          {proj.projectUrl.replace("https://", "")}
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>
                  {proj.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {proj.skills.map((s: Skill) => (
                        <span
                          key={s.id}
                          className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No projects added</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default ApplicationDetailPage;