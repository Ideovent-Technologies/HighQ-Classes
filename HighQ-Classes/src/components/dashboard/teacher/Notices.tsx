import React from "react";
import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { Bell } from "lucide-react";

const Notices = () => {
  const { data, loading, error } = useTeacherDashboard();

  if (loading) return <p className="p-4">Loading notices...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (!data) return null;

  const { recentNotices, assignedBatches } = data;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-navy-600">
        <Bell className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Recent Notices</h2>
      </div>

      {recentNotices.length === 0 ? (
        <p className="text-gray-500">No recent notices posted.</p>
      ) : (
        <ul className="space-y-4">
          {recentNotices.map((notice) => {
            const targetBatches = assignedBatches
              .filter((b) => notice.targetBatchIds.includes(b._id))
              .map((b) => b.name)
              .join(", ");

            return (
              <li key={notice._id} className="p-4 bg-white shadow-md rounded-lg border">
                <h3 className="text-lg font-semibold text-navy-700">{notice.title}</h3>
                <p className="text-sm text-gray-700 mt-1">{notice.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Target: {notice.targetAudience === "batch" ? targetBatches : "All Students"}
                </p>
                <p className="text-xs text-gray-400">
                  Posted on: {new Date(notice.createdAt).toLocaleDateString()}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Notices;
