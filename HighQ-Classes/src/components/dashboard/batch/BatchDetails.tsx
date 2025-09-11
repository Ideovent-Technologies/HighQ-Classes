import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Batch } from "@/types/batch.types";
import { BatchService } from "@/API/services/admin/batches.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Info } from "lucide-react";
import { motion } from "framer-motion";

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
        if (response.success && response.data) {
          setBatch(response.data);
          setError(null);
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
        {error}
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-10 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-2">{batch.name}</h1>
          <p className="text-lg">
            {batch.courseId?.name || "Unknown Course"} •{" "}
            {batch.teacherId?.name || "No Teacher Assigned"}
          </p>
        </div>
      </div>

      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Batch Info */}
        <motion.div whileHover={{ scale: 1.02 }} className="col-span-1 lg:col-span-1">
          <Card className="rounded-2xl shadow-md border">
            <CardHeader className="flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-500" />
              <CardTitle>Batch Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              {batch.description && (
                <p>
                  <strong>Description:</strong> {batch.description}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Schedule */}
        <motion.div whileHover={{ scale: 1.02 }} className="col-span-1 lg:col-span-1">
          <Card className="rounded-2xl shadow-md border">
            <CardHeader className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <p>
                <strong>Start:</strong>{" "}
                {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "N/A"}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : "N/A"}
              </p>
              {batch.schedule && (
                <>
                  <p>
                    <strong>Days:</strong>{" "}
                    {batch.schedule.days?.length > 0
                      ? batch.schedule.days.join(", ")
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {batch.schedule.startTime && batch.schedule.endTime
                      ? `${batch.schedule.startTime} - ${batch.schedule.endTime}`
                      : "N/A"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Students */}
        <motion.div whileHover={{ scale: 1.02 }} className="col-span-1 lg:col-span-1">
          <Card className="rounded-2xl shadow-md border">
            <CardHeader className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <CardTitle>Students ({batch.students?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {batch.students?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {batch.students.map((student) => (
                    <Badge
                      key={student._id}
                      className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 shadow-sm hover:bg-gray-200"
                    >
                      {student.name}
                      {student.email ? ` (${student.email})` : ""}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No students enrolled.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BatchDetails;
