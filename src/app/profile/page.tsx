"use client";

import { GetStudentProfile } from "@/services/StudentProfile";
import { useEffect, useState } from "react";

export default function Page() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const data = await GetStudentProfile(token);
        setProfile(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Student Profile</h1>

      {profile ? (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(profile, null, 2)}
        </pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}