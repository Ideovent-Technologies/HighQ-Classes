

import React, { useEffect, useState } from "react";
import { Recording } from "@/modul/recordings/dummyRecordings";
import { getRecordings, saveAllRecordings } from "@/utils/storage";
import { useNavigate } from "react-router-dom";

const StudentRecordings: React.FC = () => {
  const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);

    const all = getRecordings();

    const filtered = all
      .filter((rec) => {
        const created = new Date(rec.date);
        return created >= threeDaysAgo && created <= today && rec.isActive;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const latestThree = filtered.slice(0, 3);

    if (filtered.length > 3) {
      const idsToKeep = latestThree.map((r) => r.id);
      const newStorage = all.filter((r) => idsToKeep.includes(r.id));
      saveAllRecordings(newStorage);
    }

    setFilteredRecordings(latestThree);
  }, []);

  const handleWatch = (id: string) => {
    navigate(`/recordings/watch/${id}`);
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-[#fffefb] via-[#fdf5f0] to-[#f5f7fd]">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#1A2540]">
        🎥 Last <span className="text-[#F97316]">3 Days</span> Class Recordings
      </h2>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {filteredRecordings.length > 0 ? (
          filteredRecordings.map((rec, idx) => (
            <div
              key={rec.id}
              className="relative bg-white border border-gray-200 shadow-md rounded-2xl p-6 min-h-[240px] hover:shadow-lg transition-all duration-300 text-[#1A2540]"
            >
              <div
                className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-1 rounded-full text-sm font-bold uppercase text-white shadow-md
                ${idx === 0 ? "bg-gradient-to-r from-blue-400 to-blue-600" :
                  idx === 1 ? "bg-gradient-to-r from-green-400 to-green-600" :
                    "bg-gradient-to-r from-pink-500 to-fuchsia-600"}`}
              >
                {idx === 0 ? "Basic" : idx === 1 ? "Standard" : "Premium"}
              </div>

              <div className="flex items-center justify-between mb-4 mt-6">
                <h3 className="text-xl font-semibold text-[#1A2540]">{rec.title}</h3>
                <span className="text-xs text-gray-500">
                  {new Date(rec.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-[#3e4757] mb-2">📚 {rec.subject}</p>
              <p className="text-sm text-[#3e4757] mb-4">👁 {rec.views} views</p>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => handleWatch(rec.id)} // ✅ Using id
                  className="inline-block bg-[#1A2540] text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-[#27366f] transition"
                >
                  ▶️ Watch Now
                </button>

                <a
                  href={rec.url}
                  download
                  className="inline-block bg-[#F97316] text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-orange-600 transition"
                >
                  ⬇️ Download
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-[#6b7280]">
            No recent recordings found.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentRecordings;
