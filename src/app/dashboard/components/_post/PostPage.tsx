"use client";
import { useState } from "react";
import axios from "axios";

export default function PostInternshipForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(true);
  const [locationType, setLocationType] = useState(0); // 0 = Remote, 1 = Onsite, 2 = Hybrid
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [departmentId, setDepartmentId] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      isPaid,
      locationType,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      deadlineDate: new Date(deadlineDate).toISOString(),
      departmentId
    };

    try {
      const res = await axios.post(
        "https://khalida06-001-site1.ntempurl.com/api/Internships",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // token varsa
          },
        }
      );
      console.log("Internship yaradıldı:", res.data);
      alert("Internship uğurla yaradıldı!");
    } catch (error: any) {
      console.error("FULL ERROR:", error);
      if (error.response?.data) {
        console.log("BACKEND ERRORS:", error.response.data.errors);
      }
      alert("Xəta baş verdi. Konsola baxın.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="border p-2 rounded" />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required className="border p-2 rounded" />
      <select value={locationType} onChange={(e) => setLocationType(Number(e.target.value))} className="border p-2 rounded">
        <option value={0}>Remote</option>
        <option value={1}>Onsite</option>
        <option value={2}>Hybrid</option>
      </select>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="border p-2 rounded" />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="border p-2 rounded" />
      <input type="date" value={deadlineDate} onChange={(e) => setDeadlineDate(e.target.value)} required className="border p-2 rounded" />
      <input type="number" value={departmentId} onChange={(e) => setDepartmentId(Number(e.target.value))} required className="border p-2 rounded" placeholder="Department ID" />
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} /> Paid
      </label>
      <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Submit</button>
    </form>
  );
}