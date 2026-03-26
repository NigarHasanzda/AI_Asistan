"use client";

import { getMyApplications } from '@/services/Apply';
import { analyzeProfile } from '@/services/StudentProfile';
import React, { useEffect, useState } from 'react';


const Page = () => {
  const [profile, setProfile] = useState<any>(null); // state-də məlumat saxlayırıq
  const [loading, setLoading] = useState(true);      // loading vəziyyəti
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await analyzeProfile();
        console.log("Profile Data:", data); // konsola da çıxart
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Xəta baş verdi");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p className="text-red-500">Xəta: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profil Analizi</h1>

      {profile ? (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(profile, null, 2)}
        </pre>
      ) : (
        <p>Profil məlumatı tapılmadı.</p>
      )}
    </div>
  );
};

export default Page;