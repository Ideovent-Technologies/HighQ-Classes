import React from "react";
import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { Bell } from "lucide-react";

const Notices = () => {
  const { data, loading, error } = useTeacherDashboard();

  if (loading) return <p className="p-6 text-lg font-medium">Loading notices...</p>;
  if (error) return <p className="p-6 text-red-500 font-semibold">Error: {error}</p>;
  if (!data || !data.recentNotices) return null;

  const { recentNotices, assignedBatches } = data;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="w-6 h-6 text-yellow-500" />
        <h2 className="text-3xl font-bold text-navy-700">Recent Notices</h2>
      </div>

      {recentNotices.length === 0 ? (
        <div className="text-center text-gray-500 italic">No recent notices posted.</div>
      ) : (
        <ul className="space-y-5">
          {recentNotices.map((notice) => {
            const targetBatches = assignedBatches
              .filter((b) => notice.targetBatchIds.includes(b._id))
              .map((b) => b.name);

            return (
              <li
                key={notice._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-navy-800 mb-1">{notice.title}</h3>
                <p className="text-gray-700 text-sm mb-3">{notice.description}</p>

                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="text-xs text-gray-500">
                    Posted on:{" "}
                    <span className="text-gray-700 font-medium">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </span>

                  <span className="text-xs text-gray-500">
                    Target:{" "}
                    {notice.targetAudience === "batch" && targetBatches.length > 0 ? (
                      <span className="inline-flex flex-wrap gap-1">
                        {targetBatches.map((batch) => (
                          <span
                            key={batch}
                            className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-xs"
                          >
                            {batch}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-gray-700 font-medium">All Students</span>
                    )}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Notices;
