

import React from "react";

interface Recording {
  title: string;
  subject: string;
  date: string;
  fileUrl: string;
  views: number;
}

const RecordingCard: React.FC<Recording> = ({ title, subject, date, fileUrl, views }) => {
  return (
    <div
      className={`rounded-xl shadow-lg p-4 text-white relative overflow-hidden ${
        subject === "Math" || subject === "Science" ? "bg-gradient-to-r from-blue-500 to-blue-700" : "bg-gradient-to-r from-orange-500 to-red-500"
      }`}
    >
      {/* NEW badge */}
      <span className="absolute top-0 left-0 bg-white text-blue-600 font-bold text-xs px-2 py-1 rounded-br-md">
        NEW
      </span>

      {/* Box image dummy */}
      <div className="flex justify-center mb-4">
        <div className="w-10 h-16 bg-white/70 rounded-sm shadow-md mx-1"></div>
        <div className="w-8 h-12 bg-white/60 rounded-sm shadow-md mx-1"></div>
        <div className="w-6 h-10 bg-white/40 rounded-sm shadow-md mx-1"></div>
      </div>

      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm">📘 {subject}</p>
      <p className="text-sm">📅 {date}</p>
      <p className="text-sm">👁️ {views} views</p>

      {/* Price & Download Button */}
      <div className="flex justify-between items-center mt-4">
       
        <a
          href={fileUrl}
          download
          className="bg-white text-black text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
        >
          ⬇ Download
        </a>
      </div>
    </div>
  );
};

const RecordingCardPage: React.FC = () => {
  const recordings: Recording[] = [
    {
      title: "Math Class - Algebra",
      subject: "Math",
      date: "2025-07-24",
      fileUrl: "https://example.com/math.mp4",
      views: 23,
    },
    {
      title: "Science Class - Physics",
      subject: "Science",
      date: "2025-07-24",
      fileUrl: "https://example.com/science.mp4",
      views: 12,
    },
    {
      title: "English Class - Grammar",
      subject: "English",
      date: "2025-07-23",
      fileUrl: "https://example.com/english.mp4",
      views: 17,
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-center text-xl font-semibold mb-6">
       
      </h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recordings.map((rec, index) => (
          <RecordingCard key={index} {...rec} />
        ))}
      </div>
    </div>
  );
};

export default RecordingCardPage;

