import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // Added Label import
import { Loader2, ChevronLeft, Plus } from "lucide-react"; // Added Plus icon import
// Importing Course and CourseTopic interfaces from your types file
import { Course, CourseTopic } from "@/types/course.types";
import CourseService from "@/API/services/courseService";
import { useToast } from "@/hooks/use-toast"; // Using your project's toast hook for consistency

// NEW: Interface for creating new course data (without _id, createdAt, updatedAt)
interface CreateCourseData {
    name: string;
    description?: string;
    duration: string;
    fee: number;
    topics?: CourseTopic[];
    // batches, createdAt, updatedAt are typically server-generated on creation or optional
}

// UPDATED: CourseFormProps now includes onSubmit and onClose props
interface CourseFormProps {
    course?: Course | null; // Can be a Course object for editing, or null for new
    onSubmit: (data: CreateCourseData | Partial<Course>) => Promise<void>;
    onClose: () => void; // Function to close the form, typically passed from parent
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onSubmit, onClose }) => {
    // Removed useNavigate as navigation/form closing is handled by the onClose prop from the parent
    const { toast } = useToast(); // Initialize useToast hook

    // State for form data, can be CreateCourseData for new or Partial<Course> for update
    const [formData, setFormData] = useState<CreateCourseData | Partial<Course>>({
        name: "",
        description: "",
        duration: "",
        fee: 0,
        topics: [],
    });
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator during submission

    // Populate form data when 'course' prop changes (for editing existing courses)
    useEffect(() => {
        if (course) {
            setFormData({
                _id: course._id, // Keep _id for updates
                name: course.name,
                description: course.description,
                duration: course.duration,
                fee: course.fee,
                topics: course.topics || [], // Ensure topics is an array
                batches: course.batches || [], // Ensure batches is an array
            });
        } else {
            // Reset form for new course creation
            setFormData({
                name: "",
                description: "",
                duration: "",
                fee: 0,
                topics: [],
            });
        }
    }, [course]); // Re-run effect when 'course' prop changes

    /**
     * Handles changes to input and textarea elements, updating the formData state.
     */
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "fee" ? Number(value) : value, // Convert fee to number
        }));
    };

    /**
     * Handles changes to individual topic fields within the topics array.
     * Corrected field name from 'name' to 'title' for CourseTopic.
     */
    const handleTopicChange = (
        index: number,
        field: keyof CourseTopic, // Ensures field is 'title', 'description', or 'order'
        value: string | number // Value can be string or number for order
    ) => {
        const newTopics = [...(formData.topics || [])]; // Ensure topics array exists
        newTopics[index] = { ...newTopics[index], [field]: value };
        setFormData((prev) => ({ ...prev, topics: newTopics }));
    };

    /**
     * Adds a new empty topic object to the topics array.
     */
    const addTopic = () => {
        setFormData((prev) => ({
            ...prev,
            topics: [...(prev.topics || []), { title: "", description: "", order: (prev.topics?.length || 0) + 1 }],
        }));
    };

    /**
     * Removes a topic from the topics array by index.
     */
    const removeTopic = (index: number) => {
        const newTopics = (formData.topics || []).filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, topics: newTopics }));
    };

    /**
     * Handles form submission. Validates data and calls the onSubmit prop.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default browser form submission
        setIsLoading(true); // Set loading state

        // Basic validation for required fields
        if (!formData.name || !formData.duration || formData.fee === undefined) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields: Course Name, Duration, and Fee.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            // Call the onSubmit prop, letting the parent handle API interaction and success/error toasts
            await onSubmit(formData);
            // Parent's onSubmit is expected to call onClose or similar
        } catch (err) {
            console.error("CourseForm submission error:", err);
            // This toast is a fallback, primary error handling is in parent's onSubmit
            toast({
                title: "Error",
                description: "An unexpected error occurred during form submission.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <Card className="max-w-3xl mx-auto my-8 p-6 shadow-xl rounded-xl bg-white"> {/* Added modern styling */}
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-6"> {/* Improved header layout */}
                <div className="flex items-center">
                    <Button
                        variant="ghost" // Use ghost variant for back button for subtlety
                        size="icon"
                        onClick={onClose} // Use onClose prop
                        className="mr-2 text-gray-600 hover:bg-gray-100 rounded-full"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        {course ? "Edit Course" : "Create New Course"}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased space-y */}
                    <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">Course Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g., Advanced Physics 101"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">Course Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Provide a detailed description of the course content."
                            value={formData.description || ""}
                            onChange={handleInputChange}
                            rows={4}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-1">Duration</Label>
                            <Input
                                id="duration"
                                name="duration"
                                placeholder="e.g., 6 weeks, 3 months"
                                value={formData.duration || ""}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <Label htmlFor="fee" className="text-sm font-medium text-gray-700 mb-1">Course Fee ($)</Label>
                            <Input
                                id="fee"
                                name="fee"
                                placeholder="e.g., 299.99"
                                type="number"
                                value={formData.fee || 0}
                                onChange={handleInputChange}
                                required
                                min={0}
                                step="0.01"
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 border p-4 rounded-md bg-gray-50"> {/* Styled topics section */}
                        <p className="font-semibold text-lg text-gray-800 flex items-center">
                            <img src="https://placehold.co/20x20/ffffff/000000?text=📚" alt="Topic Icon" className="mr-2"/> Topics
                        </p>
                        {formData.topics?.map((topic, index) => (
                            <Card key={index} className="p-4 space-y-3 shadow-sm border border-gray-200 rounded-lg"> {/* Styled individual topic card */}
                                <Input
                                    placeholder="Topic Title"
                                    value={topic.title}
                                    onChange={(e) => handleTopicChange(index, "title", e.target.value)}
                                    required
                                    className="block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <Textarea
                                    placeholder="Topic Description (Optional)"
                                    value={topic.description || ""}
                                    onChange={(e) => handleTopicChange(index, "description", e.target.value)}
                                    rows={2}
                                    className="block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeTopic(index)}
                                    className="w-full text-red-700 hover:bg-red-50"
                                >
                                    Remove Topic
                                </Button>
                            </Card>
                        ))}
                        <Button
                            type="button"
                            onClick={addTopic}
                            variant="outline"
                            className="w-full border-dashed border-gray-400 text-gray-600 hover:bg-gray-100"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Topic
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg py-2 text-xl font-bold transition-all duration-300 shadow-xl transform hover:scale-[1.01]"
                    >
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</>
                        ) : course ? "Update Course" : "Create Course"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default CourseForm;
