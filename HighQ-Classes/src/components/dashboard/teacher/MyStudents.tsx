import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { User, Megaphone, Calendar, BookOpen } from "lucide-react";

const MyStudents = () => {
    const { data, loading, error } = useTeacherDashboard();

    if (loading)
        return (
            <p className="p-6 text-lg text-blue-600 animate-pulse">
                Loading students...
            </p>
        );

    if (error)
        return <p className="p-6 text-red-500 font-semibold">Error: {error}</p>;

    if (!data) return <p className="p-6 text-gray-500">No data found.</p>;

    const { assignedBatches, assignedStudents, recentNotices } = data;

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
            <div className="max-w-6xl mx-auto space-y-8">
                <h2 className="text-4xl font-extrabold text-navy-800 text-center drop-shadow-md">
                    👩‍🏫 My Students
                </h2>

                {assignedBatches.length === 0 ? (
                    <p className="text-gray-600 text-center">
                        You are not assigned to any batches yet.
                    </p>
                ) : (
                    assignedBatches.map((batch) => {
                        const students = assignedStudents?.[batch.name] || [];
                        const notices =
                            recentNotices?.filter((n) =>
                                n.targetBatchIds?.includes(batch._id)
                            ) || [];

                        return (
                            <div
                                key={batch._id}
                                className="rounded-3xl backdrop-blur-md bg-white/70 border border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 space-y-6"
                            >
                                {/* Batch Info */}
                                <div className="mb-2">
                                    <h3 className="text-2xl font-bold text-blue-900 tracking-tight">
                                        {batch.name}
                                    </h3>
                                    <div className="mt-1 text-sm text-gray-700 space-y-1">
                                        <p className="flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-cyan-600" />
                                            <span>
                                                Course:{" "}
                                                <strong>
                                                    {/* MODIFICATION: Directly access the 'course' property */}
                                                    {batch.course || "Unknown Course"}
                                                </strong>
                                            </span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-indigo-500" />
                                            <span>
                                                Duration:{" "}
                                                <strong>
                                                    {batch.startDate
                                                        ? new Date(
                                                              batch.startDate
                                                          ).toLocaleDateString()
                                                        : "N/A"}{" "}
                                                    -{" "}
                                                    {batch.endDate
                                                        ? new Date(
                                                              batch.endDate
                                                          ).toLocaleDateString()
                                                        : "N/A"}
                                                </strong>
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Students List */}
                                <div className="mt-2">
                                    <h4 className="text-lg font-semibold text-blue-800 flex items-center gap-2 mb-3">
                                        <User className="w-5 h-5 text-blue-500" />
                                        Enrolled Students ({students.length})
                                    </h4>

                                    {students.length > 0 ? (
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-800">
                                            {students.map((student) => (
                                                <li
                                                    key={student._id}
                                                    className="bg-blue-50 border border-blue-100 rounded-xl p-3 shadow hover:bg-blue-100 hover:scale-[1.02] transition-all"
                                                >
                                                    <p className="font-semibold">
                                                        {student.name}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        {student.email}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-400 text-sm">
                                            No students enrolled yet.
                                        </p>
                                    )}
                                </div>

                                {/* Notices */}
                                {notices.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-lg font-semibold text-blue-800 flex items-center gap-2 mb-2">
                                            <Megaphone className="w-5 h-5 text-yellow-500" />
                                            Recent Notices
                                        </h4>
                                        <ul className="space-y-2 text-sm text-gray-800">
                                            {notices.map((notice) => (
                                                <li
                                                    key={notice._id}
                                                    className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg shadow hover:bg-yellow-100"
                                                >
                                                    <span className="font-semibold text-yellow-800">
                                                        {notice.title}:
                                                    </span>{" "}
                                                    <span className="text-gray-700">
                                                        {notice.description}
                                                    </span>
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
        </div>
    );
};

export default MyStudents;