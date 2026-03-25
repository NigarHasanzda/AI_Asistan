"use client";

import React, { useState, useEffect } from "react";
import { getMyInterviews, getInterviewById } from "@/services/MockInterview";
import api from "@/libs/api";
import { useParams, useRouter } from "next/navigation";

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
  isCompleted?: boolean;
  totalScore?: number;
}

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const idFromUrl = params?.id as string;
  const mode = params?.mode as string;

  const [ticketNumber, setTicketNumber] = useState<number | "">("");
  const [interview, setInterview] = useState<Interview | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [allInterviews, setAllInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    fetchInterviews();
    if (idFromUrl) loadInterview(Number(idFromUrl));
  }, [idFromUrl]);

  const fetchInterviews = async () => {
    try {
      const data = await getMyInterviews({ page: 1, pageSize: 20 });
      setAllInterviews(data);
    } catch (err) {
      console.error("Müsahibələri gətirərkən xəta:", err);
    }
  };

  const loadInterview = async (id: number) => {
    setLoading(true);
    setError(null);
    setAnswers({});
    setCurrentIndex(0);

    try {
      const data = await getInterviewById(id);
      setInterview(data);
      setTicketNumber(id);

      setQuestions(data.questions || []);

      if (!data.questions || data.questions.length === 0) setError("Sual tapılmadı");
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!interview || !questions.length || interview.isCompleted) return;

    const currentQuestion = questions[currentIndex];
    const answer = answers[currentQuestion.order];
    if (!answer) return alert("Zəhmət olmasa cavab yazın");

    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/MockInterviews/my-interviews/${interview.id}/submit-answer?questionOrder=${currentQuestion.order}`,
        `"${answer}"`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        alert("Təbriklər! Müsahibə bitdi 🎉");

        const updatedInterview = await getInterviewById(interview.id);
        setInterview(updatedInterview);
        setQuestions(updatedInterview.questions || []);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error(err);
      alert("Cavab göndərilərkən xəta oldu");
    }
  };

  const handleRetry = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/MockInterviews/my-interviews/${id}/retry`,
        null,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      const newId = response.data; // yenilənmiş müsahibə ID-si
      alert("Müsahibə yenidən başladı!");
      console.log(response)
      router.push(`/userdashboard/interviews/${newId}`);
      loadInterview(newId);
    } catch (err) {
      console.error(err);
      alert("Retry zamanı xəta baş verdi");
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div className="max-w-3xl w-full">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800">
              {mode ? `${mode} Practice` : "Practice Interview"}
            </h1>
          </header>

          {/* QUICK LOAD */}
          {/* <div className="flex gap-2 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <input
              type="number"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value ? Number(e.target.value) : "")}
              className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter Interview ID manually..."
            />
            <button
              onClick={() => loadInterview(Number(ticketNumber))}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Load
            </button>
          </div> */}

          {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">{error}</div>}

          {loading ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : interview?.isCompleted ? (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Final Results</h3>
              <p className="mb-4">Total Score: <span className="font-bold">{interview.totalScore ?? "N/A"}</span></p>
              {questions.map((q) => (
                <div key={q.order} className="mb-3 p-3 bg-gray-50 border rounded">
                  <p className="font-semibold">Q{q.order}: {q.questionText}</p>
                  <p>Answer: {q.answerText || answers[q.order]}</p>
                  <p>Score: {q.score ?? "Not graded"}</p>
                  {q.feedback && <p className="italic text-gray-600">Feedback: {q.feedback}</p>}
                </div>
              ))}
            </div>
          ) : questions.length > 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative">
              <div className="mb-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4 leading-relaxed">
                {questions[currentIndex].questionText}
              </h3>

              <textarea
                className="w-full border border-gray-200 p-4 rounded-xl mb-4 min-h-[150px] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Type your answer here..."
                value={answers[questions[currentIndex].order] || ""}
                onChange={(e) =>
                  setAnswers({ ...answers, [questions[currentIndex].order]: e.target.value })
                }
              />

              <div className="flex justify-end">
                <button
                  onClick={handleSubmitAnswer}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-100"
                >
                  {currentIndex === questions.length - 1 ? "Finish Interview" : "Next Question"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No questions to display.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;