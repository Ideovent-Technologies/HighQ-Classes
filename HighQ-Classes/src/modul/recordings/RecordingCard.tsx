// src/modules/recordings/RecordingCard.jsx

// import React from "react";
// import { PlayCircle, Eye } from "lucide-react";

// interface Props {
//   title: string;
//   subject: string;
//   date: string;
//   fileUrl: string;
//   views: number;
// }

// const RecordingCard: React.FC<Props> = ({ title, subject, date, fileUrl, views }) => {
//   return (
//     <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-all ">
//       <h2 className="text-lg font-semibold">{title}</h2>
//       <p className="text-sm text-gray-600">{subject}</p>
//       <p className="text-xs text-gray-400">{date}</p>

//       <div className="flex items-center justify-between mt-3">
//         <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600">
//           <PlayCircle className="w-5 h-5" />
//           <span>Play</span>
//         </a>
//         <div className="flex items-center gap-1 text-gray-500 text-sm">
//           <Eye className="w-4 h-4" />
//           {views} 
//         </div>
        
//       </div>


//        <h2 className="text-lg font-semibold">{title}</h2>
//       <p className="text-sm text-gray-600">{subject}</p>
//       <p className="text-xs text-gray-400">{date}</p>
//        <div className="flex items-center justify-between mt-3">
//         <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600">
//           <PlayCircle className="w-5 h-5" />
//           <span>Play</span>
//         </a>
//         <div className="flex items-center gap-1 text-gray-500 text-sm">
//           <Eye className="w-4 h-4" />
//           {views} 
//         </div>
        
//       </div>


//       <h2 className="text-lg font-semibold">{title}</h2>
//       <p className="text-sm text-gray-600">{subject}</p>
//       <p className="text-xs text-gray-400">{date}</p>
//        <div className="flex items-center justify-between mt-3">
//         <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600">
//           <PlayCircle className="w-5 h-5" />
//           <span>Play</span>
//         </a>
//         <div className="flex items-center gap-1 text-gray-500 text-sm">
//           <Eye className="w-4 h-4" />
//           {views} 
//         </div>
        
//       </div>
//     </div>
    
//   );

  
  
// };

// export default RecordingCard;


//right code


import React from "react";
import { PlayCircle, Eye, Download } from "lucide-react";

interface Props {
  title: string;
  subject: string;
  date: string;
  fileUrl: string;
  views: number;
}

const RecordingCard: React.FC<Props> = ({ title, subject, date, fileUrl, views }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full">
      <h2 className="text-md font-semibold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500">{subject}</p>
      <p className="text-xs text-gray-400 mb-2">📅 {new Date(date).toLocaleDateString()}</p>

      <div className="flex items-center justify-between text-sm mt-3">
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline gap-1">
          <PlayCircle className="w-4 h-4" />
          <span>Watch</span>
        </a>
        <a href={fileUrl} download className="flex items-center text-green-600 hover:underline gap-1">
          <Download className="w-4 h-4" />
          <span>Download</span>
        </a>
        <div className="flex items-center text-gray-500 gap-1">
          <Eye className="w-4 h-4" />
          <span>{views} views</span>
        </div>
      </div>
    </div>
  );
};

export default RecordingCard;



// import React from "react";
// import RecordingCard from "./RecordingCard";

// const RecordingCardPage: React.FC = () => {
//   const recordings = [
//     {
//       title: "Math Class - Algebra",
//       subject: "Math",
//       date: "2025-07-24",
//       fileUrl: "https://example.com/math.mp4",
//       views: 23,
//     },
//     {
//       title: "Science Class - Physics",
//       subject: "Science",
//       date: "2025-07-24",
//       fileUrl: "https://example.com/science.mp4",
//       views: 12,
//     },
//     {
//       title: "English Class - Grammar",
//       subject: "English",
//       date: "2025-07-23",
//       fileUrl: "https://example.com/english.mp4",
//       views: 17,
//     },
//   ];

//   return (
//     <div className="p-6">
//       <h1 className="text-center text-xl font-semibold mb-6 flex items-center justify-center gap-2">
//         🎥 Last 3 Days Class Recordings
//       </h1>
//       <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
//         {recordings.map((rec, index) => (
//           <RecordingCard key={index} {...rec} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RecordingCardPage;
