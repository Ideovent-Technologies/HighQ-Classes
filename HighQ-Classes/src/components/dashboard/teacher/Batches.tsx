import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarDays, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Batches = () => {
  const { data, loading, error } = useTeacherDashboard();

  if (loading) return <p className="p-4 text-gray-600">Loading batches...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (!data || !data.assignedBatches) return <p className="p-4 text-gray-500">No data available.</p>;

  const { assignedBatches, assignedStudents } = data;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-navy-600 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-teal-500" />
        Assigned Batches
      </h2>

      {assignedBatches.length === 0 ? (
        <p className="text-gray-500">No batches assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedBatches.map((batch) => {
            const students = Array.isArray(assignedStudents?.[batch.name]) ? assignedStudents[batch.name] : [];

            return (
              <Card
                key={batch._id}
                className="shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                {/* Optional: Wrap in Link if batch detail page exists */}
                {/* <Link to={`/dashboard/batches/${batch._id}`}> */}
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-navy-700">{batch.name}</h3>
                      <Badge className="bg-teal-100 text-teal-700 text-xs">{batch.course}</Badge>
                    </div>

                    {batch.startDate && batch.endDate ? (
                      <div className="text-sm text-gray-700">
                        <CalendarDays className="inline w-4 h-4 mr-1 text-navy-500" />
                        {format(new Date(batch.startDate), "PP")} -{" "}
                        {format(new Date(batch.endDate), "PP")}
                      </div>
                    ) : (
                      <div className="text-sm text-red-400 italic">Date not available</div>
                    )}

                    <div className="pt-2">
                      <p className="font-medium text-sm text-gray-600 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {students.length} Students
                      </p>
                      <ul className="mt-1 text-sm text-gray-700 space-y-1 pl-4 list-disc">
                        {students.slice(0, 3).map((s) => (
                          <li key={s._id}>
                            {s.name}{" "}
                            <span className="text-xs text-gray-500">({s.email})</span>
                          </li>
                        ))}
                        {students.length > 3 && (
                          <li className="text-xs text-teal-600">
                            +{students.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                {/* </Link> */}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Batches;
