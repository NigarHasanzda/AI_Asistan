"use client";

import { getMyApplications, withdrawApplication } from '@/services/Apply';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [applications, setApplications] = useState<any[]>([]);

  const handleWithdraw = async (id: number) => {
    if (!confirm("Müraciəti geri çəkmək istəyirsən?")) return;

    try {
      await withdrawApplication(id);

      // ✅ UI-dan da sil (refresh etmədən)
      setApplications((prev) => prev.filter((item) => item.id !== id));

      alert("Müraciət geri çəkildi ❌");
    } catch (err: any) {
      alert(err.message || "Xəta baş verdi");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyApplications();
        console.log("My Applications:", data);

        setApplications(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-500">Heç bir müraciət yoxdur</p>
      ) : (
        <div className="space-y-4">
          {applications.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-xl flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="font-semibold text-lg">
                  {item.internshipTitle}
                </p>
                <p className="text-sm text-gray-500">
                  {item.companyName}
                </p>
                <p className="text-xs text-blue-600 font-bold mt-1">
                  {item.status}
                </p>
              </div>

              <button
                onClick={() => handleWithdraw(item.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Withdraw
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;