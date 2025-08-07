import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Batch } from "@/types/Batch.Types";

interface BatchCardProps {
  batch: Batch;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch }) => {
  const {
    _id,
    name,
    courseId,
    teacherId,
    students,
    status = "active", // fallback default
  } = batch;

  const courseName = typeof courseId === "object" && courseId !== null ? courseId.name : String(courseId);
  const teacherName = typeof teacherId === "object" && teacherId !== null ? teacherId.name : "N/A";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{name}</span>
          <Badge variant="secondary">{status}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>Course:</strong> {courseName || "N/A"}
        </p>
        <p>
          <strong>Teacher:</strong> {teacherName}
        </p>
        <p>
          <strong>Students:</strong> {students?.length ?? 0}
        </p>

        <div className="mt-4">
          <Link to={`/dashboard/batches/${_id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchCard;
