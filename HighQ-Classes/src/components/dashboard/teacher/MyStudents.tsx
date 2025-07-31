import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { User, Megaphone } from "lucide-react";

const MyStudents = () => {
  const { data, loading, error } = useTeacherDashboard();

  if (loading) return <p className="p-4 text-lg font-medium">Loading students...</p>;
  if (error) return <p className="p-4 text-red-500 font-semibold">Error: {error}</p>;
  if (!data) return null;

  const { assignedBatches, assignedStudents, recentNotices } = data;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-navy-700">👩‍🎓 My Students</h2>

      {assignedBatches.map((batch) => {
        const students = assignedStudents[batch.name] || [];
        const notices = recentNotices.filter((notice) =>
          notice.targetBatchIds.includes(batch._id)
        );

        return (
          <div
            key={batch._id}
            className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
          >
            {/* Batch Info */}
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-navy-600">{batch.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                📘 Course: <span className="font-medium">{batch.course}</span> <br />
                🗓️ Duration:{" "}
                {new Date(batch.startDate).toLocaleDateString()} -{" "}
                {new Date(batch.endDate).toLocaleDateString()}
              </p>
            </div>

            {/* Students List */}
            <div className="mt-3">
              <h4 className="text-lg font-semibold flex items-center gap-2 mb-2 text-navy-600">
                <User className="w-5 h-5" />
                Enrolled Students ({students.length})
              </h4>

              {students.length > 0 ? (
                <ul className="pl-5 list-disc text-gray-700 space-y-1">
                  {students.map((student) => (
                    <li key={student._id}>
                      <span className="font-medium">{student.name}</span>{" "}
                      <span className="text-sm text-gray-500">({student.email})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No students enrolled yet.</p>
              )}
            </div>

            {/* Notices */}
            {notices.length > 0 && (
              <div className="mt-5">
                <h4 className="text-lg font-semibold flex items-center gap-2 mb-2 text-navy-600">
                  <Megaphone className="w-5 h-5" />
                  Recent Notices
                </h4>
                <ul className="pl-5 list-disc text-gray-700 space-y-1">
                  {notices.map((notice) => (
                    <li key={notice._id}>
                      <strong>{notice.title}</strong>{" "}
                      <span className="text-sm text-gray-500">— {notice.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MyStudents;
