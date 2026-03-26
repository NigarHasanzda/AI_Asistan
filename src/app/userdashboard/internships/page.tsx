"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Building2,
  Banknote,
  ChevronRight,
  Heart
} from "lucide-react";

import { getMatchedInternships, startPracticeInterview } from "@/services/InternshipServices";
import {
  addBookmark,
  applyToInternship,
  getBookmarks,
  removeBookmark
} from "@/services/Apply";

interface Internship {
  id: number;
  title: string;
  companyName: string;
  locationType: number;
  overAllMatchScore: number;
  isPaid: boolean;
  paymentStatus: string;
}

const InternshipHub = () => {
  const router = useRouter();

  const categories = [
    "All",
    "Engineering",
    "Design",
    "Product",
    "Marketing",
    "Data Science"
  ];

  const [internships, setInternships] = useState<Internship[]>([]);
  const [filtered, setFiltered] = useState<Internship[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);


  // ✅ Data fetch
  useEffect(() => {
    setMounted(true);

    const fetchData = async () => {
      try {
        const data = await getMatchedInternships();
        console.log("Matched Internships:", data);

        if (data && Array.isArray(data.internships)) {
          setInternships(data.internships);
          setFiltered(data.internships);
        }
      } catch (error) {
        console.error(error);
        setInternships([]);
        setFiltered([]);
      }
    };

    const fetchBookmarks = async () => {
      try {
        const data = await getBookmarks();
        const ids = data.map((item: any) => item.internshipId);
        setBookmarkedIds(ids);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    fetchBookmarks();
  }, []);

  // ✅ Apply
  const handleApply = async (id: number) => {
    try {
      await applyToInternship(id);
      alert("Uğurla müraciət etdin 🚀");
    } catch (err: any) {
      alert(err.message || "Xəta baş verdi");
    }
  };

  const handlePractice = async (id: number) => {
    try {
      const result = await startPracticeInterview(id); // <--- sən verdiyin POST funksiyası
      console.log("Practice result:", result);

      // Backend cavabında interview ID varsa istifadə et, yoxsa internship ID ilə yönləndir
      const interviewId = result?.id || id;
      router.push(`/userdashboard/interviews/${result}`);
    } catch (err: any) {
      alert(err.message || "Practice zamanı xəta baş verdi");
    }
  };
  // ✅ Bookmark toggle
  const toggleBookmark = async (id: number) => {
    try {
      if (bookmarkedIds.includes(id)) {
        await removeBookmark(id);
        setBookmarkedIds(prev => prev.filter(item => item !== id));
      } else {
        await addBookmark(id);
        setBookmarkedIds(prev => [...prev, id]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Filter + Search
  useEffect(() => {
    let temp = [...internships];

    if (selectedCategory !== "All") {
      temp = temp.filter(item =>
        item.title.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (searchTerm) {
      temp = temp.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(temp);
  }, [selectedCategory, searchTerm, internships]);

  // ✅ Detail page
  const openDetail = (item: Internship) => {
    localStorage.setItem("selectedInternship", JSON.stringify(item));
    // router.push(`/userdashboard/internships/${item.id}`);
  };

  // ✅ Location format
  const formatLocation = (loc: number) => {
    switch (loc) {
      case 0:
        return "Onsite";
      case 1:
        return "Remote";
      case 2:
        return "Hybrid";
      default:
        return "Unknown";
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-2 font-sans">
      <div className="max-w-[100%] mx-auto">

        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Internship Hub
        </h1>

        {/* 🔍 Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search internships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-4 pl-12 pr-4 bg-white border border-slate-100 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 🎯 Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm ${selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 📦 List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <p className="text-center text-gray-500">
              No internships found
            </p>
          )}

          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => openDetail(item)}
              className="flex justify-between items-center p-6 bg-white rounded-2xl shadow cursor-pointer"
            >
              <div className="flex gap-6 items-center">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-xl">
                  {item.companyName[0]}
                </div>

                <div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {item.companyName}
                  </p>
                  <p className="text-xs text-blue-500">
                    {formatLocation(item.locationType)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-center">

                {/* ❤️ Bookmark */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(item.id);
                  }}
                >
                  <Heart
                    className={
                      bookmarkedIds.includes(item.id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400"
                    }
                  />
                </button>

                {/* 🚀 Apply */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(item.id);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Apply
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePractice(item.id);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Practice
                </button>
                <ChevronRight />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InternshipHub;