import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Course } from "@/types/course.types"; // Using the provided Course type

// Mock data that now conforms to the new Course interface
const mockCourses: Course[] = [
    {
        _id: "C101",
        name: "Physics for Engineers",
        description: "An introductory course on fundamental physics principles for engineering students, covering mechanics, thermodynamics, and electromagnetism.",
        duration: "16 weeks",
        fee: 15000,
        topics: [
            { title: "Mechanics", order: 1 },
            { title: "Thermodynamics", order: 2 },
        ]
    },
    {
        _id: "C102",
        name: "Organic Chemistry",
        description: "A comprehensive study of the structure, properties, and reactions of organic compounds, including synthesis and spectroscopy.",
        duration: "14 weeks",
        fee: 12000,
        topics: [
            { title: "Hydrocarbons", order: 1 },
            { title: "Functional Groups", order: 2 },
        ]
    },
    {
        _id: "C103",
        name: "Calculus I",
        description: "An essential course covering the fundamentals of differential and integral calculus, including limits, derivatives, and applications.",
        duration: "15 weeks",
        fee: 10000,
        topics: [
            { title: "Limits and Continuity", order: 1 },
            { title: "Derivatives", order: 2 },
        ]
    },
];

interface CourseListProps {
    courses: Course[];
}

const CourseList: React.FC<CourseListProps> = ({ courses = mockCourses }) => {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <Table>
                <TableCaption>A list of all available courses.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {courses.map(course => (
                        <TableRow key={course._id}>
                            <TableCell className="font-medium">{course.name}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{course.description}</TableCell>
                            <TableCell>{course.duration}</TableCell>
                            <TableCell>₹{course.fee}</TableCell>
                            <TableCell className="text-right">
                                <Link to={`/dashboard/courses/${course._id}`}>
                                    <Button size="sm" variant="outline">View</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CourseList;