"use client";

import React, { useState, useEffect } from "react";
import {
  CreateStudentProfile,
  UploadStudentPhoto,
  CreateStudentSkill,
  CreateProject,
  CreateExperience,
} from "@/services/CreateStudent";
import { GetTargetJobs } from "@/services/TargetJob";

const Page = () => {
  const [fullname, setFullname] = useState("");
  const [targetJobId, setTargetJobId] = useState<number>(0);
  const [targetJobs, setTargetJobs] = useState<{ id: number; name: string }[]>(
    []
  );

  const [photo, setPhoto] = useState<File | null>(null);
  const [skill, setSkill] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [projectSkills, setProjectSkills] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const jobs = await GetTargetJobs();
      setTargetJobs(jobs);
    };
    fetchJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token") || "";
    if (!token) return alert("Token yoxdur");

    try {
      /* 1️⃣ PROFILE */
      const profilePayload = { fullname, targetJobId };
      await CreateStudentProfile(profilePayload);

      /* 2️⃣ PHOTO */
      if (photo) {
        await UploadStudentPhoto(photo, token);
      }

      /* 3️⃣ SKILL */
      if (skill) {
        await CreateStudentSkill(skill, token);
      }

      /* 4️⃣ PROJECT */
      const skillNames = projectSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (projectName) {
        await CreateProject(
          {
            name: projectName,
            description: projectDescription,
            projectUrl,
            skillNames,
          },
          token
        );
      }

      /* 5️⃣ EXPERIENCE */
      if (companyName) {
        await CreateExperience(
          {
            companyName,
            designation,
            startDate,
            endDate,
            description,
          },
          token
        );
      }

      alert("Hamısı uğurla göndərildi 🚀");
    } catch (err) {
      console.error(err);
      alert("Xəta baş verdi");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen bg-gray-100 flex flex-col items-center p-10 space-y-10"
    >
      {/* PROFILE */}
      <div className="bg-white p-6 rounded shadow w-full max-w-lg space-y-3">
        <h2 className="text-blue-600 font-bold">Profile</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={targetJobId || ""}
          onChange={(e) => setTargetJobId(Number(e.target.value))}
        >
          <option value="">Select Target Job</option>
          {targetJobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.name}
            </option>
          ))}
        </select>
      </div>

      {/* PHOTO */}
      <div className="bg-white p-6 rounded shadow w-full max-w-lg space-y-3">
        <h2 className="text-indigo-600 font-bold">Photo</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && setPhoto(e.target.files[0])
          }
        />
      </div>

      {/* SKILL */}
      <div className="bg-white p-6 rounded shadow w-full max-w-lg space-y-3">
        <h2 className="text-green-600 font-bold">Skill</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="React / JavaScript"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
      </div>

      {/* PROJECT */}
      <div className="bg-white p-6 rounded shadow w-full max-w-lg space-y-3">
        <h2 className="text-purple-600 font-bold">Project</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Project Description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Project URL"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="React, Node, JS"
          value={projectSkills}
          onChange={(e) => setProjectSkills(e.target.value)}
        />
      </div>

      {/* EXPERIENCE */}
      <div className="bg-white p-6 rounded shadow w-full max-w-lg space-y-3">
        <h2 className="text-orange-600 font-bold">Experience</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />

        <input
          type="datetime-local"
          className="w-full border p-2 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="datetime-local"
          className="w-full border p-2 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* TEK SUBMIT */}
      <button
        type="submit"
        className="bg-black text-white px-10 py-3 rounded-lg font-semibold hover:opacity-80"
      >
        Submit All
      </button>
    </form>
  );
};

export default Page;