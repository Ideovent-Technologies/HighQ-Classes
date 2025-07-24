// src/modules/recordings/RecordingCard.jsx

import React from "react";
import { PlayCircle, Eye } from "lucide-react";

interface Props {
  title: string;
  subject: string;
  date: string;
  fileUrl: string;
  views: number;
}

const RecordingCard: React.FC<Props> = ({ title, subject, date, fileUrl, views }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-all">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-600">{subject}</p>
      <p className="text-xs text-gray-400">{date}</p>

      <div className="flex items-center justify-between mt-3">
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600">
          <PlayCircle className="w-5 h-5" />
          <span>Play</span>
        </a>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <Eye className="w-4 h-4" />
          {views} 
        </div>
      </div>
    </div>
  );

  
  
};

export default RecordingCard;



