"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getApplicationById } from "@/services/Apply";

const Page = () => {
  const params = useParams();
  const id = Number(params.id);

  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getApplicationById(id);
        console.log("Application Detail:", data);
        setApplication(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  if (!application) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Application Detail</h1>

      <p><b>Internship:</b> {application.internshipTitle}</p>
      <p><b>Company:</b> {application.companyName}</p>
      <p><b>Status:</b> {application.status}</p>
    </div>
  );
};

export default Page;