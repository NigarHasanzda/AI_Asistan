"use client";

import { getBookmarks } from "@/services/Apply";
import React, { useEffect, useState } from "react";

const page = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await getBookmarks();
        console.log("Saved Internships:", data);
        setBookmarks(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div>
      <h1>Saved Internships</h1>

      {bookmarks.map((item) => (
        <div key={item.id}>
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  );
};

export default page;