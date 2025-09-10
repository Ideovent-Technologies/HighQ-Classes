import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Batch } from "@/types/batch.types";
import { BatchService } from "@/API/services/admin/batches.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BatchDetails: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const batchService = new BatchService();

  useEffect(() => {
    const fetchBatch = async () => {
      if (!batchId) {
        setError("Batch ID is missing from the URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await batchService.getBatchById(batchId);
        if (response.success && response.batch) {
          setBatch(response.batch);
        } else {
          setError(response.message || "Failed to fetch batch.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [batchId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading batch details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        Batch not found.
      </div>
    );
  }

  const courseName = batch.courseId?.name || "N/A";
  const teacherName = batch.teacherId?.name || "N/A";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{batch.name}</h1>

      <div className="space-y-6 max-w-2xl mx-auto">
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Batch Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <p>
              <strong>Course:</strong> {courseName}
            </p>
            <p>
              <strong>Teacher:</strong> {teacherName}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Badge
                className={`rounded-full px-3 py-1 text-sm font-semibold
                  ${batch.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                `}
              >
                {batch.status || "N/A"}
              </Badge>
            </p>
            <p>
              <strong>Capacity:</strong> {batch.capacity || "N/A"}
            </p>
            <p>
              <strong>Description:</strong> {batch.description || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <p>
              <strong>Start Date:</strong>{" "}
              {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "N/A"}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : "N/A"}
            </p>
            {batch.schedule && (
              <>
                <p>
                  <strong>Days:</strong> {batch.schedule.days.join(", ")}
                </p>
                <p>
                  <strong>Time:</strong> {batch.schedule.startTime} - {batch.schedule.endTime}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              Enrolled Students ({batch.students?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {batch.students?.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {batch.students.map((student, index) => (
                  <li key={student._id || index}>
                    {student.name} {student.email ? `(${student.email})` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No students enrolled.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BatchDetails;
