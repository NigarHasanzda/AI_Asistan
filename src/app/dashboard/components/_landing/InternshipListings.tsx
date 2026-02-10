import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const listings = [
  {
    title: "Frontend Engineering Intern",
    location: "Remote",
    period: "Summer 2024",
    date: "Oct 12, 2023",
    status: "Active",
    statusColor: "bg-[#DCFCE7] text-[#15803D]",
    applicants: 456,
    avatars: ["https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2", "https://i.pravatar.cc/150?u=3"]
  },
  {
    title: "Product Management Intern",
    location: "San Francisco, CA",
    period: "Spring 2024",
    date: "Oct 08, 2023",
    status: "Draft",
    statusColor: "bg-[#FEF9C3] text-[#854D0E]",
    applicants: 0,
    avatars: []
  },
  {
    title: "Data Science Intern",
    location: "New York, NY",
    period: "Summer 2024",
    date: "Oct 01, 2023",
    status: "Active",
    statusColor: "bg-[#DCFCE7] text-[#15803D]",
    applicants: 289,
    avatars: ["https://i.pravatar.cc/150?u=4", "https://i.pravatar.cc/150?u=5"]
  }
];

const InternshipListings = () => {
  return (
    <section className="w-full mt-8 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden font-sans">
      {/* Cədvəl Başlığı və Alətlər */}
      <div className="p-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-[22px] font-bold text-[#111827]">
          Active Internship Listings
        </h2>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <FilterListIcon />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <SearchIcon />
          </button>
        </div>
      </div>

      {/* Cədvəl Strukturu */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F9FAFB] border-y border-gray-50">
            <tr>
              <th className="px-8 py-4 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider">Internship Title</th>
              <th className="px-8 py-4 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider">Date Posted</th>
              <th className="px-8 py-4 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
              <th className="px-8 py-4 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider">Applicants</th>
              <th className="px-8 py-4 text-[13px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {listings.map((job, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="font-bold text-[#111827] text-[15px]">{job.title}</div>
                  <div className="text-[#6B7280] text-[13px] mt-1">{job.location} • {job.period}</div>
                </td>
                <td className="px-8 py-6 text-[#4B5563] text-[14px] font-medium">
                  {job.date}
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${job.statusColor}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {job.applicants > 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {job.avatars.map((url, i) => (
                          <img 
                            key={i} 
                            src={url} 
                            className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                            alt="applicant" 
                          />
                        ))}
                        {job.applicants > 3 && (
                           <div className="w-8 h-8 rounded-full bg-[#6366F1] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                              +{job.applicants - 3}
                           </div>
                        )}
                      </div>
                      <span className="text-[#6B7280] text-[13px] font-semibold">{job.applicants} Total</span>
                    </div>
                  ) : (
                    <span className="text-[#9CA3AF] text-[14px]">---</span>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <MoreHorizIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default InternshipListings;