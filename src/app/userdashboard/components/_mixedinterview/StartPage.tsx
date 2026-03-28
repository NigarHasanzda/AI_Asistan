"use client";

import React, { useState, useEffect } from "react";
import { getMyInterviews, getInterviewById } from "@/services/MockInterview";
import api from "@/services/api";

interface Question {
  order: number;
  questionText: string;
  answerText?: string | null;
  score?: number;
  feedback?: string | null;
}

interface Interview {
  id: number;
  mode?: string;
  level?: string;
  role?: string;
  questions?: Question[];
  [key: string]: any;
}

const PracticeInterviewPage = () => {
  const [ticketNumber, setTicketNumber] = useState<number | "">("");
  const [interview, setInterview] = useState<Interview | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [allInterviews, setAllInterviews] = useState<Interview[]>([]); // bütün biletlər

  // Komponent mount olanda bütün biletləri gətir
  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const interviews = await getMyInterviews({ page: 1, pageSize: 10 });
      console.log("All my interviews:", interviews);
      setAllInterviews(interviews);
    } catch (err) {
      console.error("Get my interviews error:", err);
    }
  };

  // Input və ya kliklə interview yükləmə funksiyası
  const loadInterview = async (id: number) => {
    setLoading(true);
    setError(null);
    setInterview(null);
    setQuestions([]);
    setAnswers({});

    try {
      const practiceData = await getInterviewById(id);
      setInterview(practiceData);
      setQuestions(practiceData.questions || []);
      console.log("Loaded interview:", practiceData);

      if (!practiceData.questions) {
        setError("Serverdən heç bir sual gəlmədi.");
      }
    } catch (err: any) {
      console.error("Get interview by ID error:", err);
      setError(err.response?.data?.message || err.message || "Xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  // Inputdan düymə ilə yükləmə
  const handleStart = () => {
    if (!ticketNumber) {
      alert("Zəhmət olmasa bilet nömrəsini daxil edin");
      return;
    }
    loadInterview(Number(ticketNumber));
  };

  // Suallara cavab göndərmə funksiyası
  const handleSubmitAnswer = async (questionOrder: number) => {
    const answer = answers[questionOrder];
    if (!answer) {
      alert("Zəhmət olmasa cavab daxil edin");
      return;
    }

    if (!interview) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tapılmadı");

      await api.post(
        `/MockInterviews/my-interviews/${interview.id}/submit-answer?questionOrder=${questionOrder}`,
        `"${answer}"`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(`Q${questionOrder} cavabı göndərildi!`);
    } catch (err: any) {
      console.error("Submit answer error:", err);
      alert("Cavab göndərilərkən xəta baş verdi.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-100 p-4">
      <div className="bg-white rounded-xl shadow-md max-w-3xl w-full p-8 mb-6">
        <h1 className="text-2xl md:text-3xl font-black mb-4">Practice Interview</h1>

        {/* Bilet nömrəsi input */}
        <div className="mb-6 flex gap-3 items-center">
          <input
            type="number"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value ? Number(e.target.value) : "")}
            placeholder="Bilet nömrəsini daxil edin"
            className="w-48 p-2 border border-gray-300 rounded-xl"
          />
          <button
            onClick={handleStart}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load Interview"}
          </button>
        </div>

        {/* Bütün biletlər listi */}
        {allInterviews.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">All My Tickets:</h2>
            <div className="flex flex-wrap gap-2">
              {allInterviews.map((i) => (
                <button
                  key={i.id}
                  onClick={() => loadInterview(i.id)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
                >
                  Ticket #{i.id}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tam interview məlumatı */}
        {interview && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
            <p><span className="font-semibold">Bilet nömrəsi:</span> {interview.id}</p>
            {interview.mode && <p><span className="font-semibold">Mode:</span> {interview.mode}</p>}
            {interview.level && <p><span className="font-semibold">Level:</span> {interview.level}</p>}
            {interview.role && <p><span className="font-semibold">Role:</span> {interview.role}</p>}
          </div>
        )}

        {/* Xəta mesajı */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Suallar */}
        <div className="flex flex-col gap-6">
          {questions.map((q) => (
            <div key={q.order} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-bold mb-2">Q{q.order}: {q.questionText}</p>

              {q.answerText && (
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Answer:</span> {q.answerText}
                </p>
              )}

              <textarea
                value={answers[q.order] || ""}
                onChange={(e) => setAnswers({ ...answers, [q.order]: e.target.value })}
                placeholder="Cavabınızı bura yazın..."
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
              />

              <button
                onClick={() => handleSubmitAnswer(q.order)}
                className="px-3 py-1 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Submit Answer
              </button>

              {q.score !== undefined && (
                <p className="text-gray-500 text-sm mt-2">
                  <span className="font-semibold">Score:</span> {q.score}
                </p>
              )}
              {q.feedback && (
                <p className="text-gray-500 text-sm italic">
                  <span className="font-semibold">Feedback:</span> {q.feedback}
                </p>
              )}
            </div>
          ))}
        </div>

        {loading && <p className="mt-4 text-gray-500">Loading interview...</p>}
      </div>
    </div>
  );
};

export default PracticeInterviewPage;