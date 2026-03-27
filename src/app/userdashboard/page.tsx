"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { analyzeProfile, getStudentDashboard } from "@/services/StudentProfile";
import { getStreak } from "@/services/MockInterview";

ChartJS.register(ArcElement, Tooltip, Legend);

const Page = () => {
  const [profile, setProfile] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await analyzeProfile();
        setProfile(profileData);
        console.log("Profile Data:", profileData);

        const streakData = await getStreak();
        setStreak(streakData);
        console.log("Streak Data:", streakData);

        const dashboardData = await getStudentDashboard();
        setDashboard(dashboardData);
        console.log("Dashboard Data:", dashboardData);

        if (streakData) {
          setToast(
            streakData.practicedToday
              ? "Bu gün artıq intervyu etmisiniz! ✅"
              : "Bu gün intervyu etməmisiniz! 🔔"
          );
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Xəta baş verdi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) return <p className="text-center mt-10">Yüklənir...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">Xəta: {error}</p>;

  const chartData = profile
    ? {
        labels: ["Score", "Remaining"],
        datasets: [
          {
            data: [profile.score, 100 - profile.score],
            backgroundColor: ["#4f46e5", "#e5e7eb"],
            borderWidth: 1,
          },
        ],
      }
    : null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 50 }}
            className={`fixed top-5 right-5 px-6 py-4 rounded-2xl shadow-lg z-50 text-sm font-bold ${
              streak?.practicedToday ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium banner */}
      {!dashboard?.isPremium && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg">
          <strong>Premium planı sınayın!</strong> Daha ətraflı analiz və eksklüziv imkanlar üçün.
        </div>
      )}

      {/* Profile card with chart */}
      {profile && (
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row gap-6 items-center">
          {chartData && <Doughnut data={chartData} className="w-48" />}
          <div className="flex-1 space-y-3">
            <p>
              <strong>Score:</strong> {profile.score}
            </p>
            <p>
              <strong>Feedback:</strong> {profile.feedback}
            </p>
            <button
              onClick={async () => {
                const newProfile = await analyzeProfile();
                setProfile(newProfile);
                console.log("Yeni analiz:", newProfile);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Yeni Analysis
            </button>
          </div>
        </div>
      )}

      {/* User info */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="font-bold text-lg mb-2">İstifadəçi</h2>
            <p><strong>Ad Soyad:</strong> {dashboard.fullname}</p>
            <p><strong>Profil Score:</strong> {dashboard.profileScore}</p>
            {dashboard.isPremium && <span className="px-2 py-1 bg-indigo-600 text-white rounded">Premium</span>}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="font-bold text-lg mb-2">Applications</h2>
            <p><strong>Total:</strong> {dashboard.totalApplications}</p>
            <p><strong>Pending:</strong> {dashboard.pendingApplications}</p>
            <p><strong>Accepted:</strong> {dashboard.acceptedApplications}</p>
            <p><strong>Rejected:</strong> {dashboard.rejectedApplications}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="font-bold text-lg mb-2">Interviews</h2>
            <p><strong>Total:</strong> {dashboard.totalInterviews}</p>
            <p><strong>Average Score:</strong> {dashboard.averageInterviewScore.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Recent applications */}
      {dashboard?.recentApplications?.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="font-bold text-lg mb-2">Recent Applications</h2>
          <ul className="space-y-2">
            {dashboard.recentApplications.map((app: any) => (
              <li key={app.id} className="flex justify-between border-b py-2">
                <span>{app.internshipTitle} @ {app.companyName}</span>
                <span className={`font-bold ${app.status === "Pending" ? "text-yellow-600" : app.status === "Accepted" ? "text-green-600" : "text-red-600"}`}>
                  {app.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Saved internships */}
      {dashboard?.savedInternships?.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="font-bold text-lg mb-2">Saved Internships</h2>
          <ul className="space-y-2">
            {dashboard.savedInternships.map((intern: any) => (
              <li key={intern.internshipId} className="flex justify-between border-b py-2">
                <span>{intern.title} @ {intern.companyName}</span>
                <span>{intern.locationType}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Page;