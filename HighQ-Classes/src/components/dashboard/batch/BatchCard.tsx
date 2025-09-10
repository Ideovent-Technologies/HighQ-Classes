import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface CourseRef {
  _id: string;
  name: string;
}

interface TeacherRef {
  _id: string;
  name: string;
}

interface StudentRef {
  _id: string;
  name: string;
  email?: string;
}

export interface Batch {
  _id: string;
  name: string;
  courseId: CourseRef;
  teacherId: TeacherRef;
  students: StudentRef[];
  schedule?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  status?: "active" | "inactive" | "completed";
  capacity?: number;
  description?: string;
}

interface BatchCardProps {
  batch: Batch;
  onEdit?: (batch: Batch) => void;
  onDelete?: (batchId: string) => void;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    _id,
    name,
    courseId,
    teacherId,
    students,
    status = "active", // fallback default
  } = batch;

  const courseName = courseId?.name || "N/A";
  const teacherName = teacherId?.name || "N/A";

  const handleEdit = () => {
    if (onEdit) {
      onEdit(batch);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(_id);
      setShowConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-xl font-bold">
          <span>{name}</span>
          <Badge
            className={`rounded-full px-3 py-1 text-sm font-semibold
              ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            `}
          >
            {status}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm text-gray-700">
        <p>
          <strong>Course:</strong> {courseName}
        </p>
        <p>
          <strong>Teacher:</strong> {teacherName}
        </p>
        <p>
          <strong>Students:</strong> {students?.length ?? 0}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`/dashboard/batches/${_id}`} className="flex-1">
            <Button size="sm" variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </Link>

          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}

          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteClick}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>

      {/* Confirmation Modal UI */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full space-y-4 text-center">
            <h3 className="text-xl font-bold">Confirm Deletion</h3>
            <p className="text-gray-600">
              Are you sure you want to delete the batch "<span className="font-semibold">{name}</span>"? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <Button variant="outline" onClick={cancelDelete} className="flex-1">
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} className="flex-1">
                Delete
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
};

export default BatchCard;
