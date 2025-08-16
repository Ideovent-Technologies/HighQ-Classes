import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Assuming Course and CourseTopic interfaces are correctly imported from a shared types file
// or defined locally if not part of a global types structure.
// In this setup, we'll use the interfaces defined in Course-management.tsx for consistency.

// Mocked imports for compilation in this environment.
// In your actual project, these would resolve to your real local files.
import CourseService from "@/API/services/courseService";
import { useToast } from "@/hooks/use-toast"; // Assuming useToast is available

// Re-defining CourseTopic and Course interfaces to ensure they are available within this component's scope
// This should ideally come from a shared types file, e.g., '@/types/course.types'
export interface CourseTopic {
    title: string;
    description?: string;
    order?: number;
}

// Ensure this matches the Course interface in Course-management.tsx
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

// Interface for new course data (without _id, createdAt, updatedAt)
export interface CreateCourseData {
    name: string;
    description?: string;
    duration: string;
    fee: number;
    topics?: CourseTopic[];
    batches?: any[];
}

// Define the props interface for CourseForm with optional props for backward compatibility
interface CourseFormProps {
    course?: Course | null; // Null for new course, Course object for editing
    onClose?: () => void; // Function to call when form is closed/cancelled
    onSubmit?: (
        submittedCourse: CreateCourseData | Partial<Course>
    ) => Promise<void>; // Function to handle form submission
}

const CourseForm: React.FC<CourseFormProps> = ({
    course,
    onClose,
    onSubmit,
}) => {
    const { toast } = useToast(); // Initialize toast hook

    const [formData, setFormData] = useState<
        CreateCourseData | Partial<Course>
    >(
        course
            ? { ...course }
            : {
                  // If editing, pre-fill with course data, otherwise start fresh
                  name: "",
                  description: "",
                  duration: "",
                  fee: 0,
                  topics: [],
              }
    );

    const [loading, setLoading] = useState(false);

    // Effect to update form data if the 'course' prop changes (e.g., when switching from creating to editing)
    useEffect(() => {
        if (course) {
            setFormData({ ...course });
        } else {
            setFormData({
                name: "",
                description: "",
                duration: "",
                fee: 0,
                topics: [],
            });
        }
    }, [course]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "fee" ? Number(value) : value,
        }));
    };

    const handleTopicChange = (
        index: number,
        field: keyof CourseTopic,
        value: string
    ) => {
        const newTopics = [...(formData.topics || [])]; // Ensure topics is an array
        newTopics[index] = { ...newTopics[index], [field]: value };
        setFormData((prev) => ({ ...prev, topics: newTopics }));
    };

    const addTopic = () => {
        setFormData((prev) => ({
            ...prev,
            topics: [
                ...(prev.topics || []),
                {
                    title: "",
                    description: "",
                    order: (prev.topics?.length || 0) + 1,
                },
            ],
        }));
    };

    const removeTopic = (index: number) => {
        const newTopics = (formData.topics || []).filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, topics: newTopics }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (onSubmit) {
                await onSubmit(formData); // Use the onSubmit prop to handle the actual API call
            } else {
                // Default behavior when no onSubmit prop is provided
                const API_BASE_URL = "http://localhost:8080/api";

                if (course && course._id) {
                    // Update existing course
                    const response = await fetch(
                        `${API_BASE_URL}/admin/courses/${course._id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`,
                            },
                            body: JSON.stringify(formData),
                        }
                    );

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(
                            error.message || "Failed to update course"
                        );
                    }

                    toast({
                        title: "Success",
                        description: "Course updated successfully!",
                    });
                } else {
                    // Create new course
                    const response = await fetch(
                        `${API_BASE_URL}/admin/courses`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`,
                            },
                            body: JSON.stringify(formData),
                        }
                    );

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(
                            error.message || "Failed to create course"
                        );
                    }

                    toast({
                        title: "Success",
                        description: "Course created successfully!",
                    });
                }

                // Navigate back or close form
                if (onClose) {
                    onClose();
                } else {
                    window.history.back();
                }
            }
        } catch (err) {
            console.error("Form submission error:", err);
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "There was an issue saving the course.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-3xl mx-auto my-8 p-6 shadow-xl rounded-xl bg-white">
            <CardHeader className="mb-4">
                <CardTitle className="text-3xl font-bold text-gray-800">
                    {course ? "Edit Course" : "Create New Course"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Course Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g., Advanced JavaScript"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Course Description
                        </label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="A comprehensive course covering..."
                            value={formData.description}
                            onChange={handleInputChange}
                            className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="duration"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Duration
                            </label>
                            <Input
                                id="duration"
                                name="duration"
                                placeholder="e.g., 6 weeks, 3 months"
                                value={formData.duration}
                                onChange={handleInputChange}
                                required
                                className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="fee"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Course Fee
                            </label>
                            <Input
                                id="fee"
                                name="fee"
                                placeholder="e.g., 500"
                                type="number"
                                value={formData.fee}
                                onChange={handleInputChange}
                                required
                                className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                        <p className="font-semibold text-gray-800 text-lg">
                            Course Topics
                        </p>
                        {formData.topics && formData.topics.length > 0 ? (
                            formData.topics.map((topic, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-3 p-4 border border-gray-200 rounded-md bg-white shadow-sm"
                                >
                                    <div>
                                        <label
                                            htmlFor={`topic-title-${index}`}
                                            className="block text-xs font-medium text-gray-600 mb-1"
                                        >
                                            Topic Title
                                        </label>
                                        <Input
                                            id={`topic-title-${index}`}
                                            placeholder="Topic Title"
                                            value={topic.title}
                                            onChange={(e) =>
                                                handleTopicChange(
                                                    index,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`topic-description-${index}`}
                                            className="block text-xs font-medium text-gray-600 mb-1"
                                        >
                                            Topic Description
                                        </label>
                                        <Textarea
                                            id={`topic-description-${index}`}
                                            placeholder="Topic Description"
                                            value={topic.description}
                                            onChange={(e) =>
                                                handleTopicChange(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="p-2 text-sm min-h-[60px]"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeTopic(index)}
                                        className="w-full text-sm py-2 rounded-md hover:opacity-90 transition-opacity"
                                    >
                                        Remove Topic
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm italic">
                                No topics added yet.
                            </p>
                        )}
                        <Button
                            type="button"
                            onClick={addTopic}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors"
                        >
                            Add Topic
                        </Button>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose || (() => window.history.back())}
                            className="px-6 py-2 rounded-full shadow-md hover:bg-gray-100 transition-colors border border-gray-300 text-gray-700"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="px-8 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : course ? (
                                "Update Course"
                            ) : (
                                "Create Course"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CourseForm;
