"use client";

import React, { useState } from "react";
import { resetPassword } from "@/services/ForgotPassword";

const page = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Şifrələr uyğun deyil");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await resetPassword({
        email,
        code,
        newPassword,
        confirmPassword,
      });

      setMessage(res.message || "Şifrə uğurla dəyişdirildi");
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-[400px]">

        <h2 className="text-2xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        {message && (
          <p className="text-green-600 mb-3 text-center">{message}</p>
        )}

        {error && (
          <p className="text-red-600 mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="6 rəqəmli kod"
            className="border p-2 rounded"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
          />

          <input
            type="password"
            placeholder="Yeni şifrə"
            className="border p-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Şifrəni təkrar et"
            className="border p-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Yenilənir..." : "Şifrəni Yenilə"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default page;