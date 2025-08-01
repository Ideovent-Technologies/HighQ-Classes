import React from "react";
import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Schedule = () => {
  const { data, loading, error } = useTeacherDashboard();

  if (loading)
    return <div className="p-6 text-lg font-medium">Loading schedule...</div>;

  if (error)
    return <div className="p-6 text-red-500">Error: {error}</div>;

  // Ensure it's always an array (even if data is undefined or corrupted)
  const todaySchedule = Array.isArray(data?.todaySchedule)
    ? data.todaySchedule
    : [];

  console.log("Rendering schedule, length:", todaySchedule.length);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-navy-600 flex items-center gap-2">
        <CalendarDays className="w-6 h-6 text-teal-500" />
        Today's Schedule
      </h2>

      {todaySchedule.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No classes scheduled for today.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaySchedule.map((session, index) => (
            <Card
              key={index}
              className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <CardContent className="p-5 space-y-3">
                <div className="text-xl font-semibold text-navy-700">
                  {session.courseId?.title || "Untitled Course"}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Batch: {session.batchId?.name || "Unknown"}
                </div>
                <div className="flex items-center gap-2 text-sm text-navy-600">
                  <Clock3 className="w-4 h-4 text-teal-500" />
                  {session.startTime} - {session.endTime}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  Mode:{" "}
                  <span className="font-semibold text-gray-700 capitalize">
                    {session.mode || "online"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
