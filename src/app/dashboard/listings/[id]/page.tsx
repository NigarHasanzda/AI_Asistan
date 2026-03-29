"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { getInternshipById } from "@/services/InternshipServices";
import Link from "next/link";

interface Skill {
  id: number;
  name: string;
}

interface Internship {
  id: number;
  title: string;
  description: string;
  companyName: string;
  departmentName: string;
  applicationCount: number;
  deadlineDate: string;
  startDate: string;
  endDate: string;
  isClosed: boolean;
  isPaid: boolean;
  paymentStatus: string;
  skills: Skill[];
  locationType: number; 
}

const InternshipDetailPage = () => {
  const { id } = useParams();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const data = await getInternshipById(Number(id));
        setInternship(data);
      } catch (err: any) {
        setError("Məlumat yüklənərkən xəta baş verdi");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error || !internship)
    return (
      <div className="text-center py-20 text-red-500 font-medium bg-slate-50">
        {error || "Məlumat tapılmadı"}
      </div>
    );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("az-AZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[90%] mx-auto px-4 py-8 md:px-8 md:py-12 space-y-8">

        {/* Back Button */}
        <Link
          href="/dashboard/listings"
          className="inline-flex items-center gap-1.5 text-sm text-indigo-700 font-semibold hover:text-indigo-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Geri qayıt
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header Card */}
            <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              
              <div className="flex justify-between items-start mb-5">
                <div className="space-y-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide border border-indigo-100">
                    {internship.departmentName}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                    {internship.title}
                  </h1>
                  <p className="text-lg text-indigo-600 font-semibold">
                    {internship.companyName}
                  </p>
                </div>

                <span
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    internship.isClosed
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  }`}
                >
                  {internship.isClosed ? "Bağlanıb" : "Aktiv"}
                </span>
              </div>

              {/* Meta Row */}
              <div className="flex flex-wrap gap-3 border-t border-b border-slate-100 py-6 my-6">
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl text-sm text-slate-700 border border-slate-100">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium">Başlanğıc: {formatDate(internship.startDate)}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl text-sm text-slate-700 border border-slate-100">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium">Son tarix: {formatDate(internship.deadlineDate)}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl text-sm text-slate-700 border border-slate-100">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium">{internship.applicationCount} müraciət</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight text-sm">Təsvir</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-base">
                  {internship.description}
                </p>
              </div>
            </section>

            {/* Skills Card */}
            <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-5 uppercase tracking-tight">
                Tələb olunan bacarıqlar
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {internship.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-5 py-2.5 bg-indigo-900 text-white rounded-2xl text-sm font-medium shadow-sm hover:bg-indigo-800 transition-colors"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-8">

              {/* Accent bar */}
              <div className="h-1.5 w-12 rounded-full bg-indigo-600 mb-6" />

              <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-tight">Xülasə</h3>

              <div className="space-y-4">

                {/* Payment Status */}
                <div className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-4 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <DollarSign className="w-4 h-4 text-indigo-700" />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">Ödəniş statusu</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-900">
                    {internship.paymentStatus}
                  </span>
                </div>

                {/* Type */}
                <div className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-4 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-indigo-700" />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">Növü</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-900">
                    {internship.isPaid ? "Pullu Təcrübə" : "Ödənişsiz"}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-4 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <MapPin className="w-4 h-4 text-indigo-700" />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">Məkan növü</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-900">
                    {internship.locationType === 0 ? "Remote" : "On-site"}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              {/* <button
                className={`w-full mt-8 py-4 px-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg ${
                  internship.isClosed
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-indigo-900 text-white shadow-indigo-200 hover:bg-indigo-950 hover:-translate-y-0.5 active:scale-95"
                }`}
                disabled={internship.isClosed}
              >
                {internship.isClosed ? "Müraciət bağlanıb" : "İndi müraciət et"}
              </button> */}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default InternshipDetailPage;