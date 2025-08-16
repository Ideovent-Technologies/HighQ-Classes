import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Batch } from "@/types/Batch.Types";
import { Eye, Edit, Trash2 } from "lucide-react";

interface BatchCardProps {
    batch: Batch;
    onEdit?: (batch: Batch) => void;
    onDelete?: (batchId: string) => void;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch, onEdit, onDelete }) => {
    const {
        _id,
        name,
        courseId,
        teacherId,
        students,
        status = "active", // fallback default
    } = batch;

    const courseName =
        typeof courseId === "object" && courseId !== null
            ? courseId.name
            : String(courseId);
    const teacherName =
        typeof teacherId === "object" && teacherId !== null
            ? teacherId.name
            : "N/A";

    const handleEdit = () => {
        if (onEdit) {
            onEdit(batch);
        }
    };

    const handleDelete = () => {
        if (
            onDelete &&
            window.confirm(
                `Are you sure you want to delete the batch "${name}"?`
            )
        ) {
            onDelete(_id);
        }
    };

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

                <div className="mt-4 flex gap-2">
                    <Link to={`/dashboard/batches/${_id}`}>
                        <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                        </Button>
                    </Link>

                    {onEdit && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEdit}
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                    )}

                    {onDelete && (
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default BatchCard;
