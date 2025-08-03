import React from "react";
import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";

const Notices = () => {
  const { data, loading, error } = useTeacherDashboard();

  if (loading) return <p className="p-6 text-lg font-medium">Loading notices...</p>;
  if (error) return <p className="p-6 text-red-500 font-semibold">Error: {error}</p>;
  if (!data || !data.recentNotices) return null;

  const { recentNotices, assignedBatches } = data;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-yellow-600 drop-shadow-sm" />
          <h2 className="text-4xl font-extrabold text-blue-800 tracking-tight drop-shadow-md">
            Recent Notices
          </h2>
        </div>

        {/* If no notices */}
        {recentNotices.length === 0 ? (
          <div className="text-center text-gray-500 italic">
            No recent notices posted.
          </div>
        ) : (
          <motion.ul
            className="grid md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {recentNotices.map((notice, index) => {
              const targetBatches = assignedBatches
                .filter((b) => notice.targetBatchIds.includes(b._id))
                .map((b) => b.name);

              return (
                <motion.li
                  key={notice._id}
                  className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{notice.title}</h3>
                  <p className="text-gray-700 text-sm mb-4">{notice.description}</p>

                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <span>
                      📅 <span className="font-semibold">Posted:</span>{" "}
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      🎯 <span className="font-semibold">Target:</span>{" "}
                      {notice.targetAudience === "batch" && targetBatches.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {targetBatches.map((batch) => (
                            <span
                              key={batch}
                              className="bg-sky-200 text-sky-900 px-3 py-0.5 rounded-full text-xs font-semibold"
                            >
                              {batch}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="font-medium text-gray-800">All Students</span>
                      )}
                    </span>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default Notices;
