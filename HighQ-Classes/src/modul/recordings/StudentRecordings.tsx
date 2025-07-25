// // // src/modules/recordings/StudentRecordings.jsx

//right code

// import React, { useEffect, useState } from "react";
// import RecordingCard from "./RecordingCard";

// import { dummyRecordings, Recording } from "./dummyRecordings";

// const StudentRecordings: React.FC = () => {
//   const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);

//   useEffect(() => {
//     const today = new Date();
//     const threeDaysAgo = new Date();
//     threeDaysAgo.setDate(today.getDate() - 3);

//     const filtered = dummyRecordings
//       .filter((rec) => {
//         const created = new Date(rec.date);
//         return created >= threeDaysAgo && created <= today && rec.isActive;
//       })
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

//     setFilteredRecordings(filtered);
//   }, []);

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6 text-center">
//         🎥 Last 3 Days Class Recordings
//       </h2>
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {filteredRecordings.length > 0 ? (
//           filteredRecordings.map((rec) => (
//             <RecordingCard
//   key={rec.id}
//   title={rec.title}
//   subject={rec.subject}
//   date={rec.date}
//   fileUrl={rec.url}
//   views={rec.views}
// />

//             // <RecordingCard
//             //   key={rec.id}
//             //   title={rec.title}
//             //   subject={rec.subject}
//             //   date={new Date(rec.date).toLocaleDateString()}
//             //   fileUrl={rec.url}
//             //   views={rec.views}
//             // />
//           ))
//         ) : (
//           <p className="text-gray-500 col-span-full text-center">
//             No recent recordings found.
//           </p>
//         )}
//       </div>
      
//     </div>
//   );
// };

// export default StudentRecordings;


import React, { useEffect, useState } from "react";
import RecordingCard from "./RecordingCard";
import { Recording } from "./dummyRecordings";
import { getRecordings } from "@/utils/storage";

const StudentRecordings: React.FC = () => {
  const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    const today = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);

    const recordings = getRecordings();

    const filtered = recordings
      .filter((rec) => {
        const created = new Date(rec.date);
        return created >= threeDaysAgo && created <= today && rec.isActive;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredRecordings(filtered);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🎥 Last 3 Days Class Recordings
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecordings.length > 0 ? (
          filteredRecordings.map((rec) => (
            <RecordingCard
              key={rec.id}
              title={rec.title}
              subject={rec.subject}
              date={rec.date}
              fileUrl={rec.url}
              views={rec.views}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No recent recordings found.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentRecordings;




// import React, { useEffect, useState } from "react";
// import RecordingCard from "./RecordingCard";
// import { Recording } from "./dummyRecordings";
// import { getRecordings } from "@/utils/storage";

// const StudentRecordings: React.FC = () => {
//   const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);

//   useEffect(() => {
//     const today = new Date();
//     const threeDaysAgo = new Date();
//     threeDaysAgo.setDate(today.getDate() - 3);

//     const recordings = getRecordings();

//     const filtered = recordings
//       .filter((rec) => {
//         const created = new Date(rec.date);
//         return created >= threeDaysAgo && created <= today && rec.isActive;
//       })
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

//     setFilteredRecordings(filtered);
//   }, []);

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6 text-center">
//         🎥 Last 3 Days Class Recordings
//       </h2>
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {filteredRecordings.length > 0 ? (
//           filteredRecordings.map((rec) => (
//             <RecordingCard
//               key={rec.id}
//               title={rec.title}
//               subject={rec.subject}
//               date={new Date(rec.date).toLocaleDateString()}
//               fileUrl={rec.url}
//               views={rec.views}
//             />
//           ))
//         ) : (
//           <p className="text-gray-500 col-span-full text-center">
//             No recent recordings found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentRecordings;
