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
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    {batch.name}
                    {/* Assuming a 'status' field will be added to the batch model for badges */}
                    <Badge variant="secondary">
                        Active
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">Course ID: {batch.courseId}</p>
                <p className="text-sm text-gray-600">Teacher ID: {batch.teacherId}</p>
                <p className="text-sm text-gray-600">Students: {batch.students.length}</p>
                <div className="flex space-x-2 mt-4">
                    <Link to={`/dashboard/batches/${batch._id}`}>
                        <Button size="sm">View Details</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default BatchCard;