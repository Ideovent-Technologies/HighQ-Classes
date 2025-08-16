import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react"; // Import icons for edit and delete

// Assuming Course interface is correctly imported from a shared types file
// or defined locally if not part of a global types structure.
// Re-defining Course interface here for completeness, though it should ideally come from '@/types/course.types'
export interface CourseTopic {
    title: string;
    description?: string;
    order?: number;
}

export interface Course {
    _id: string;
    name: string;
    description?: string;
    duration: string;
    fee: number;
    topics?: CourseTopic[];
    batches?: any[];
    createdAt?: string;
    updatedAt?: string;
}

// Define the props interface for CourseCard
interface CourseCardProps {
    course: Course;
    onEdit: (course: Course) => void; // Function to call when edit button is clicked
    onDelete: (id: string) => Promise<void>; // Function to call when delete button is clicked
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete }) => {
    return (
        <Card className="flex flex-col h-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-200 hover:border-blue-400">
            <CardHeader className="p-4 border-b border-gray-100 bg-blue-50 rounded-t-xl">
                <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-semibold text-gray-800 line-clamp-2 pr-2">
                        {course.name}
                    </CardTitle>
                    <Badge className="bg-blue-600 text-white font-bold px-3 py-1 rounded-full shadow-sm text-sm whitespace-nowrap">
                        ₹{course.fee}
                    </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Duration:</span> {course.duration}
                </p>
            </CardHeader>
            <CardContent className="flex-grow p-4 space-y-3">
                <p className="text-sm text-gray-600 line-clamp-3">
                    {course.description || "No description available."}
                </p>
                {course.topics && course.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {course.topics.slice(0, 3).map((topic, index) => ( // Show up to 3 topics
                            <Badge key={index} variant="outline" className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border-gray-300">
                                {topic.title}
                            </Badge>
                        ))}
                        {course.topics.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border-gray-300">
                                +{course.topics.length - 3} more
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(course)}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-blue-600 border-blue-400 hover:bg-blue-50 rounded-full transition-colors"
                >
                    <Edit className="h-4 w-4" />
                    Edit
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(course._id)}
                    className="flex items-center gap-1 px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                    <Trash className="h-4 w-4" />
                    Delete
                </Button>
            </div>
        </Card>
    );
};

export default CourseCard;
