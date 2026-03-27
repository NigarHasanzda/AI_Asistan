"use client";

import { getLeaderboards, toggleOptIn } from "@/services/Leaderboard";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [leaderboards, setLeaderboards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [optedIn, setOptedIn] = useState<boolean>(false); // default false

  // Leaderboard məlumatını serverdən çəkmək
  const fetchLeaderboards = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboards();
      setLeaderboards(data);

      // Fullname varsa optedIn true, yoxdursa false
      const currentUser = data.find((u: any) => u.isCurrentUser);
      setOptedIn(!!currentUser?.fullname); 
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  // Toggle funksiyası
  const handleToggle = async () => {
    try {
      await toggleOptIn(); // serverdə toggle et
      await fetchLeaderboards(); // sonra yenidən məlumatları çək
    } catch (err: any) {
      alert(err.message || "Toggle zamanı xəta baş verdi");
    }
  };

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p className="text-red-500">Xəta: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Leaderboards</h1>

      {/* Toggle button */}
      <button
        onClick={handleToggle}
        className={`mb-4 px-4 py-2 rounded ${
          optedIn ? "bg-green-500" : "bg-gray-500"
        } text-white`}
      >
        {optedIn ? "Leaderboard-dan çıx" : "Leaderboard-a qoşul"}
      </button>

      <ul className="space-y-2">
        {leaderboards.map((user: any, idx: number) => (
          <li key={idx} className="flex justify-between p-2 border rounded-lg">
            <span>{idx + 1}. {user.fullname || "Unnamed User"}</span>
            <span className="font-bold">{user.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;