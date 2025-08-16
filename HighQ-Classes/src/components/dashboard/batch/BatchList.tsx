import React from "react";
import { Batch } from "@/types/Batch.Types";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BatchListProps {
    batches: Batch[];
}

const BatchList: React.FC<BatchListProps> = ({ batches }) => {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <Table>
                <TableCaption>A list of all available batches.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Batch Name</TableHead>
                        <TableHead>Course ID</TableHead>
                        <TableHead>Teacher ID</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {batches.map((batch) => (
                        <TableRow key={batch._id}>
                            <TableCell className="font-medium">
                                {batch.name}
                            </TableCell>
                            <TableCell>
                                {typeof batch.courseId === "object"
                                    ? batch.courseId.name
                                    : batch.courseId}
                            </TableCell>
                            <TableCell>
                                {typeof batch.teacherId === "object"
                                    ? batch.teacherId.name
                                    : batch.teacherId}
                            </TableCell>
                            <TableCell>{batch.students.length}</TableCell>
                            <TableCell className="text-right">
                                <Link to={`/dashboard/batches/${batch._id}`}>
                                    <Button size="sm" variant="outline">
                                        View
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default BatchList;
