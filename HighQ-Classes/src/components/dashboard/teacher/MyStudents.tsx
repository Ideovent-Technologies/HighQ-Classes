import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { User, Megaphone, Calendar, BookOpen } from "lucide-react";

const MyStudents = () => {
  const { data, loading, error } = useTeacherDashboard();

  if (loading)
    return <p className="p-6 text-lg text-gray-600 animate-pulse">Loading students...</p>;

  if (error)
    return <p className="p-6 text-red-500 font-semibold">Error: {error}</p>;

  if (!data) return <p className="p-6 text-gray-500">No data found.</p>;

  const { assignedBatches, assignedStudents, recentNotices } = data;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-navy-800">👩‍🏫 My Students</h2>

      {assignedBatches.length === 0 ? (
        <p className="text-gray-500">You are not assigned to any batches yet.</p>
      ) : (
        assignedBatches.map((batch) => {
          const students = assignedStudents?.[batch.name] || [];
          const notices = recentNotices?.filter((n) =>
            n.targetBatchIds?.includes(batch._id)
          ) || [];

          return (
            <div
              key={batch._id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Batch Info */}
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-navy-700">{batch.name}</h3>
                <div className="mt-1 text-sm text-gray-600 space-y-1">
                  <p className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-teal-600" />
                    <span>Course: <strong>{batch.course}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>
                      Duration:{" "}
                      {batch.startDate
                        ? new Date(batch.startDate).toLocaleDateString()
                        : "N/A"}{" "}
                      -{" "}
                      {batch.endDate
                        ? new Date(batch.endDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Students List */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-navy-600 flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Enrolled Students ({students.length})
                </h4>

                {students.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 list-disc list-inside">
                    {students.map((student) => (
                      <li key={student._id} className="leading-relaxed">
                        <span className="font-medium">{student.name}</span>{" "}
                        <span className="text-gray-500">({student.email})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No students enrolled yet.</p>
                )}
              </div>

              {/* Notices */}
              {notices.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-navy-600 flex items-center gap-2 mb-2">
                    <Megaphone className="w-5 h-5 text-amber-600" />
                    Recent Notices
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                    {notices.map((notice) => (
                      <li key={notice._id}>
                        <span className="font-semibold">{notice.title}:</span>{" "}
                        <span className="text-gray-600">{notice.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyStudents;
