"use client";

import React, { useState } from "react";
import { CreateExperience } from "@/services/Auth";

const ExperienceForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Token tapılmadı. Zəhmət olmasa login olun.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const experienceData = {
      companyName,
      designation,
      startDate,
      endDate,
      description,
    };

    console.log("Göndərilən təcrübə məlumatları:", experienceData);

    try {
      const result = await CreateExperience(experienceData, token);

      setSuccess(result.message || "Experience uğurla əlavə edildi!");

      setCompanyName("");
      setDesignation("");
      setStartDate("");
      setEndDate("");
      setDescription("");
    } catch (err: any) {
      setError(err.message || "Experience əlavə edilərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Experience</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Designation</label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 font-bold rounded-md hover:bg-indigo-700 transition"
        >
          {loading ? "Yüklənir..." : "Add Experience"}
        </button>

        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default ExperienceForm;