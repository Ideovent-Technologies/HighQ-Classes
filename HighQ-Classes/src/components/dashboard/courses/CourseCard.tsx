import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course.types"; // Using the provided Course type

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    {course.name}
                    <Badge variant="secondary">Fee: ₹{course.fee}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">Duration: {course.duration}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                <div className="flex space-x-2 mt-4">
                    <Link to={`/dashboard/courses/${course._id}`}>
                        <Button size="sm">View Details</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default CourseCard;