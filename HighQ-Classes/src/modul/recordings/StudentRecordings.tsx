


// import React, { useEffect, useState } from "react";
// import { Recording } from "@/modul/recordings/dummyRecordings";
// import { getRecordings, saveAllRecordings } from "@/utils/storage";

// const StudentRecordings: React.FC = () => {
//   const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);

//   useEffect(() => {
//     const today = new Date();
//     const threeDaysAgo = new Date();
//     threeDaysAgo.setDate(today.getDate() - 3);

//     const all = getRecordings();

//     const filtered = all
//       .filter((rec) => {
//         const created = new Date(rec.date);
//         return created >= threeDaysAgo && created <= today && rec.isActive;
//       })
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

//     const latestThree = filtered.slice(0, 3);

//     if (filtered.length > 3) {
//       const idsToKeep = latestThree.map((r) => r.id);
//       const newStorage = all.filter((r) => idsToKeep.includes(r.id));
//       saveAllRecordings(newStorage);
//     }

//     setFilteredRecordings(latestThree);
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#1c2c5c] py-10 px-4">
//       <h2 className="text-3xl font-bold text-center mb-10 text-white">
//         🎥 Last 3 Days Class Recordings
//       </h2>

//       <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
//         {filteredRecordings.length > 0 ? (
//           filteredRecordings.map((rec, idx) => (
//             <div
//               key={rec.id}
//               className="relative bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 min-h-[240px] hover:shadow-2xl transition-all duration-300 text-white"
//             >
//               {/* Ribbon Header */}
//               <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-1 rounded-full text-sm font-bold uppercase text-white shadow-md
//                 ${idx === 0 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
//                   idx === 1 ? 'bg-gradient-to-r from-green-400 to-green-600' :
//                     'bg-gradient-to-r from-pink-500 to-fuchsia-600'}`}>
//                 {idx === 0 ? 'Basic' : idx === 1 ? 'Standard' : 'Premium'}
//               </div>

//               <div className="flex items-center justify-between mb-4 mt-6">
//                 <h3 className="text-xl font-semibold">{rec.title}</h3>
//                 <span className="text-xs text-gray-300">
//                   {new Date(rec.date).toLocaleDateString()}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-200 mb-2">📚 {rec.subject}</p>
//               <p className="text-sm text-gray-200 mb-4">👁 {rec.views} views</p>

//               <div className="flex gap-3 flex-wrap">
//                 <a
//                   href={rec.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-block bg-white text-[#1c2c5c] text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-gray-100 transition"
//                 >
//                   ▶️ Watch Now
//                 </a>

//                 <a
//                   href={rec.url}
//                   download
//                   className="inline-block bg-pink-500 text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-pink-600 transition"
//                 >
//                   ⬇️ Download
//                 </a>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center col-span-full text-gray-300">
//             No recent recordings found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentRecordings;




// import React, { useEffect, useState } from "react";
// import { Recording } from "@/modul/recordings/dummyRecordings";
// import { getRecordings, saveAllRecordings } from "@/utils/storage";

// const StudentRecordings: React.FC = () => {
//   const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);

//   useEffect(() => {
//     const today = new Date();
//     const threeDaysAgo = new Date();
//     threeDaysAgo.setDate(today.getDate() - 3);

//     const all = getRecordings();

//     const filtered = all
//       .filter((rec) => {
//         const created = new Date(rec.date);
//         return created >= threeDaysAgo && created <= today && rec.isActive;
//       })
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

//     const latestThree = filtered.slice(0, 3);

//     if (filtered.length > 3) {
//       const idsToKeep = latestThree.map((r) => r.id);
//       const newStorage = all.filter((r) => idsToKeep.includes(r.id));
//       saveAllRecordings(newStorage);
//     }

//     setFilteredRecordings(latestThree);
//   }, []);

//   return (
//     <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-[#f9fafb] via-[#f3f4f6] to-[#ffffff]">
//       <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#1A2540]">
//         🎥 Last <span className="text-[#F97316]">3 Days</span> Class Recordings
//       </h2>

//       <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
//         {filteredRecordings.length > 0 ? (
//           filteredRecordings.map((rec, idx) => (
//             <div
//               key={rec.id}
//               className="relative bg-white border border-gray-200 shadow-md rounded-2xl p-6 min-h-[240px] hover:shadow-lg transition-all duration-300 text-[#1A2540]"
//             >
//               {/* Ribbon Header */}
//               <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-1 rounded-full text-sm font-bold uppercase text-white shadow-md
//                 ${idx === 0 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
//                   idx === 1 ? 'bg-gradient-to-r from-green-400 to-green-600' :
//                     'bg-gradient-to-r from-pink-500 to-fuchsia-600'}`}>
//                 {idx === 0 ? 'Basic' : idx === 1 ? 'Standard' : 'Premium'}
//               </div>

//               <div className="flex items-center justify-between mb-4 mt-6">
//                 <h3 className="text-xl font-semibold">{rec.title}</h3>
//                 <span className="text-xs text-gray-500">
//                   {new Date(rec.date).toLocaleDateString()}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600 mb-2">📚 {rec.subject}</p>
//               <p className="text-sm text-gray-600 mb-4">👁 {rec.views} views</p>

//               <div className="flex gap-3 flex-wrap">
//                 <a
//                   href={rec.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-block bg-[#1A2540] text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-[#27366f] transition"
//                 >
//                   ▶️ Watch Now
//                 </a>

//                 <a
//                   href={rec.url}
//                   download
//                   className="inline-block bg-[#F97316] text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-orange-600 transition"
//                 >
//                   ⬇️ Download
//                 </a>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center col-span-full text-gray-500">
//             No recent recordings found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentRecordings;




// import React, { useEffect, useState } from "react";
// import { Recording } from "@/modul/recordings/dummyRecordings";
// import { getRecordings, saveAllRecordings } from "@/utils/storage";

// const StudentRecordings: React.FC = () => {
//   const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);

//   useEffect(() => {
//     const today = new Date();
//     const threeDaysAgo = new Date();
//     threeDaysAgo.setDate(today.getDate() - 3);

//     const all = getRecordings();

//     const filtered = all
//       .filter((rec) => {
//         const created = new Date(rec.date);
//         return created >= threeDaysAgo && created <= today && rec.isActive;
//       })
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

//     const latestThree = filtered.slice(0, 3);

//     if (filtered.length > 3) {
//       const idsToKeep = latestThree.map((r) => r.id);
//       const newStorage = all.filter((r) => idsToKeep.includes(r.id));
//       saveAllRecordings(newStorage);
//     }

//     setFilteredRecordings(latestThree);
//   }, []);

//   return (
//     <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-[#fffefb] via-[#fdf5f0] to-[#f5f7fd]">
//       <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#1A2540]">
//         🎥 Last <span className="text-[#F97316]">3 Days</span> Class Recordings
//       </h2>

//       <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
//         {filteredRecordings.length > 0 ? (
//           filteredRecordings.map((rec, idx) => (
//             <div
//               key={rec.id}
//               className="relative bg-white border border-gray-200 shadow-md rounded-2xl p-6 min-h-[240px] hover:shadow-lg transition-all duration-300 text-[#1A2540]"
//             >
//               {/* Ribbon Header */}
//               <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-1 rounded-full text-sm font-bold uppercase text-white shadow-md
//                 ${idx === 0 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
//                   idx === 1 ? 'bg-gradient-to-r from-green-400 to-green-600' :
//                     'bg-gradient-to-r from-pink-500 to-fuchsia-600'}`}>
//                 {idx === 0 ? 'Basic' : idx === 1 ? 'Standard' : 'Premium'}
//               </div>

//               <div className="flex items-center justify-between mb-4 mt-6">
//                 <h3 className="text-xl font-semibold text-[#1A2540]">{rec.title}</h3>
//                 <span className="text-xs text-gray-500">
//                   {new Date(rec.date).toLocaleDateString()}
//                 </span>
//               </div>
//               <p className="text-sm text-[#3e4757] mb-2">📚 {rec.subject}</p>
//               <p className="text-sm text-[#3e4757] mb-4">👁 {rec.views} views</p>

//               <div className="flex gap-3 flex-wrap">
//                 <a
//                   href={rec.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-block bg-[#1A2540] text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-[#27366f] transition"
//                 >
//                   ▶️ Watch Now
//                 </a>

//                 <a
//                   href={rec.url}
//                   download
//                   className="inline-block bg-[#F97316] text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-orange-600 transition"
//                 >
//                   ⬇️ Download
//                 </a>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center col-span-full text-[#6b7280]">
//             No recent recordings found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentRecordings;





// import React, { useEffect, useState } from "react";
// import { Recording } from "@/modul/recordings/dummyRecordings";
// import { getRecordings, saveAllRecordings } from "@/utils/storage";
// import { Link } from "react-router-dom"; // ✅ Import Link

// const StudentRecordings: React.FC = () => {
//   const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);

//   useEffect(() => {
//     const today = new Date();
//     const threeDaysAgo = new Date();
//     threeDaysAgo.setDate(today.getDate() - 3);

//     const all = getRecordings();

//     const filtered = all
//       .filter((rec) => {
//         const created = new Date(rec.date);
//         return created >= threeDaysAgo && created <= today && rec.isActive;
//       })
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

//     const latestThree = filtered.slice(0, 3);

//     if (filtered.length > 3) {
//       const idsToKeep = latestThree.map((r) => r.id);
//       const newStorage = all.filter((r) => idsToKeep.includes(r.id));
//       saveAllRecordings(newStorage);
//     }

//     setFilteredRecordings(latestThree);
//   }, []);

//   return (
//     <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-[#fffefb] via-[#fdf5f0] to-[#f5f7fd]">
//       <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#1A2540]">
//         🎥 Last <span className="text-[#F97316]">3 Days</span> Class Recordings
//       </h2>

//       <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
//         {filteredRecordings.length > 0 ? (
//           filteredRecordings.map((rec, idx) => (
//             <div
//               key={rec.id}
//               className="relative bg-white border border-gray-200 shadow-md rounded-2xl p-6 min-h-[240px] hover:shadow-lg transition-all duration-300 text-[#1A2540]"
//             >
//               {/* Ribbon Header */}
//               <div
//                 className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-1 rounded-full text-sm font-bold uppercase text-white shadow-md
//                 ${idx === 0 ? "bg-gradient-to-r from-blue-400 to-blue-600" :
//                   idx === 1 ? "bg-gradient-to-r from-green-400 to-green-600" :
//                     "bg-gradient-to-r from-pink-500 to-fuchsia-600"}`}
//               >
//                 {idx === 0 ? "Basic" : idx === 1 ? "Standard" : "Premium"}
//               </div>

//               <div className="flex items-center justify-between mb-4 mt-6">
//                 <h3 className="text-xl font-semibold text-[#1A2540]">{rec.title}</h3>
//                 <span className="text-xs text-gray-500">
//                   {new Date(rec.date).toLocaleDateString()}
//                 </span>
//               </div>
//               <p className="text-sm text-[#3e4757] mb-2">📚 {rec.subject}</p>
//               <p className="text-sm text-[#3e4757] mb-4">👁 {rec.views} views</p>

//               <div className="flex gap-3 flex-wrap">
//                 <a
//                   href={rec.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-block bg-[#1A2540] text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-[#27366f] transition"
//                 >
//                   ▶️ Watch Now
//                 </a>

//                 <a
//                   href={rec.url}
//                   download
//                   className="inline-block bg-[#F97316] text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-orange-600 transition"
//                 >
//                   ⬇️ Download
//                 </a>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center col-span-full text-[#6b7280]">
//             No recent recordings found.
//           </p>
//         )}
//       </div>

//       {/* ✅ Link to Test Recording Card Page */}
//       <div className="text-center mt-12">
//         <Link
//           to="/recordings/card"
//           className="inline-block text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition"
//         >
//           Go to Test Recording Card
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default StudentRecordings;



// import React, { useEffect, useState } from "react";
// import { Recording } from "@/modul/recordings/dummyRecordings";
// import { getRecordings, saveAllRecordings } from "@/utils/storage";
// import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

// const StudentRecordings: React.FC = () => {
//   const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);
//   const navigate = useNavigate(); // ✅ Initialize navigate

//   useEffect(() => {
//     const today = new Date();
//     const threeDaysAgo = new Date();
//     threeDaysAgo.setDate(today.getDate() - 3);

//     const all = getRecordings();

//     const filtered = all
//       .filter((rec) => {
//         const created = new Date(rec.date);
//         return created >= threeDaysAgo && created <= today && rec.isActive;
//       })
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

//     const latestThree = filtered.slice(0, 3);

//     if (filtered.length > 3) {
//       const idsToKeep = latestThree.map((r) => r.id);
//       const newStorage = all.filter((r) => idsToKeep.includes(r.id));
//       saveAllRecordings(newStorage);
//     }

//     setFilteredRecordings(latestThree);
//   }, []);

//   const handleWatch = (rec: Recording) => {
//     // ✅ Navigate to RecordingCard with data passed as state
//     navigate("/recordings/card", { state: rec });
//   };

//   return (
//     <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-[#fffefb] via-[#fdf5f0] to-[#f5f7fd]">
//       <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#1A2540]">
//         🎥 Last <span className="text-[#F97316]">3 Days</span> Class Recordings
//       </h2>

//       <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
//         {filteredRecordings.length > 0 ? (
//           filteredRecordings.map((rec, idx) => (
//             <div
//               key={rec.id}
//               className="relative bg-white border border-gray-200 shadow-md rounded-2xl p-6 min-h-[240px] hover:shadow-lg transition-all duration-300 text-[#1A2540]"
//             >
//               <div
//                 className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-1 rounded-full text-sm font-bold uppercase text-white shadow-md
//                 ${idx === 0 ? "bg-gradient-to-r from-blue-400 to-blue-600" :
//                   idx === 1 ? "bg-gradient-to-r from-green-400 to-green-600" :
//                     "bg-gradient-to-r from-pink-500 to-fuchsia-600"}`}
//               >
//                 {idx === 0 ? "Basic" : idx === 1 ? "Standard" : "Premium"}
//               </div>

//               <div className="flex items-center justify-between mb-4 mt-6">
//                 <h3 className="text-xl font-semibold text-[#1A2540]">{rec.title}</h3>
//                 <span className="text-xs text-gray-500">
//                   {new Date(rec.date).toLocaleDateString()}
//                 </span>
//               </div>
//               <p className="text-sm text-[#3e4757] mb-2">📚 {rec.subject}</p>
//               <p className="text-sm text-[#3e4757] mb-4">👁 {rec.views} views</p>

//               <div className="flex gap-3 flex-wrap">
//                 <button
//                   onClick={() => handleWatch(rec)}
//                   className="inline-block bg-[#1A2540] text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-[#27366f] transition"
//                 >
//                   ▶️ Watch Now
//                 </button>

//                 <a
//                   href={rec.url}
//                   download
//                   className="inline-block bg-[#F97316] text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-orange-600 transition"
//                 >
//                   ⬇️ Download
//                 </a>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center col-span-full text-[#6b7280]">
//             No recent recordings found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentRecordings;




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
