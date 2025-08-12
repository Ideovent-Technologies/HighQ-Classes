import React, { useEffect, useState } from "react";
// Mocked imports for DashboardLayout, CourseService, and CourseForm for compilation in this environment.
// In your actual project, these would resolve to your real local files.
import DashboardLayout from "@/components/dashboard/DashboardLayout"; 
import CourseService from "@/API/services/courseService";
import CourseForm from "@/components/dashboard/courses/CourseForm"; 
import CourseCard from "@/components/dashboard/courses/CourseCard"; 

// Components from Shadcn UI (assuming these are correctly available in your project)
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Icons from Lucide React
import { Plus, Loader2, BookOpen, Edit, Trash } from "lucide-react";

// Assuming you have useToast hook imported for consistency
import { useToast } from "@/hooks/use-toast";

// Local CourseTopic interface - MUST match your actual '@/types/course.types'
export interface CourseTopic {
    title: string;
    description?: string;
    order?: number;
}

// Local Course interface - IMPORTANT: This now strictly matches your actual '@/types/course.types' file
// As per your course.types.ts, 'status', 'startDate', 'endDate' are not included.
interface Course {
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

// NEW: Interface for creating new course data (without _id, createdAt, updatedAt)
// This aligns with what CourseForm expects for new course submissions
interface CreateCourseData {
    name: string;
    description?: string;
    duration: string;
    fee: number;
    topics?: CourseTopic[];
    batches?: any[];
}


const CourseManagementPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const { toast } = useToast();

    /**
     * Fetches the list of courses from the API.
     * Handles loading state and displays toast notifications for errors.
     */
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await CourseService.getAllCourses();
            if (data.courses) {
                setCourses(data.courses);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to load courses data.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred while fetching courses.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Effect hook to fetch courses when the component mounts
    useEffect(() => {
        fetchCourses();
    }, []);

    /**
     * Handles editing an existing course.
     * @param {Course} course The course object to be edited.
     */
    const handleEdit = (course: Course) => {
        setEditingCourse(course);
        setShowForm(true);
    };

    /**
     * Handles initiating the creation of a new course.
     */
    const handleCreate = () => {
        setEditingCourse(null); // Clear any existing course data
        setShowForm(true); // Show the form
    };

    /**
     * Handles deleting a course.
     * Displays a confirmation dialog and then calls the API to delete the course.
     */
    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this course? This action cannot be undone."
        );
        if (confirmed) {
            try {
                // Calling deleteCourse (camelCase) as defined in the updated CourseService.ts mock
                const response = await CourseService.deleteCourse(id);
                if (response.success) {
                    setCourses((prev) => prev.filter((c) => c._id !== id));
                    toast({
                        title: "Success",
                        description: "Course deleted successfully.",
                        duration: 3000,
                    });
                } else {
                    toast({
                        title: "Error",
                        description: response.message || "Failed to delete course.",
                        variant: "destructive",
                        duration: 3000,
                    });
                }
            } catch (error) {
                console.error("Error deleting course:", error);
                toast({
                    title: "Error",
                    description: "An unexpected error occurred while deleting the course.",
                    variant: "destructive",
                    duration: 3000,
                });
            }
        }
    };


    /**
     * Handles form submission for creating or updating a course.
     * This function is passed as a prop to CourseForm.
     * @param {CreateCourseData | Partial<Course>} submittedCourse The course data from the form.
     */
    const handleFormSubmit = async (submittedCourse: CreateCourseData | Partial<Course>) => {
        setLoading(true); // Show loading when submitting form
        try {
            let response;
            if (editingCourse) {
                // For updates, the submittedCourse is Partial<Course> including _id
                // CourseService.UpdateCourse is PascalCase
                response = await CourseService.UpdateCourse(editingCourse._id, submittedCourse);
                if (response.success) {
                    toast({ title: "Success", description: "Course updated successfully." });
                } else {
                    toast({ title: "Error", description: response.message || "Failed to update course.", variant: "destructive" });
                }
            } else {
                // For creation, the submittedCourse is CreateCourseData
                // CourseService.CreateCourse now expects CreateCourseData, so explicit casting is fine
                response = await CourseService.CreateCourse(submittedCourse as CreateCourseData);
                if (response.success) {
                    toast({ title: "Success", description: "Course created successfully." });
                } else {
                    toast({ title: "Error", description: response.message || "Failed to create course.", variant: "destructive" });
                }
            }
        } catch (error) {
            console.error("Error saving course:", error);
            toast({ title: "Error", description: "An error occurred while saving the course.", variant: "destructive" });
        } finally {
            // After submission, close form, clear editing state, and re-fetch courses
            setShowForm(false);
            setEditingCourse(null);
            fetchCourses();
        }
    };


    /**
     * Handles closing the form, usually triggered by the form's cancel action.
     * Also refreshes the course list.
     */
    const handleFormClose = () => {
        setShowForm(false);
        setEditingCourse(null);
        fetchCourses(); // Refresh list after update/create
    };

    // Calculate statistics for overview cards based on available data
    const totalCourses = courses.length;
    const coursesWithDescription = courses.filter(c => c.description && c.description.length > 0).length;
    const coursesWithTopics = courses.filter(c => c.topics && c.topics.length > 0).length;
    const coursesWithBatches = courses.filter(c => c.batches && c.batches.length > 0).length;


    return (
        <DashboardLayout>
            <div className="space-y-8 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
                {/* Dashboard Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-blue-200">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Course Management 🎓</h1>
                        <p className="text-lg text-muted-foreground mt-1">
                            Effortlessly manage your academic courses with a clear overview.
                        </p>
                    </div>
                    {/* Button to add new course, visible only when form is not shown */}
                    {!showForm && (
                        <Button
                            onClick={handleCreate}
                            className="shrink-0 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full px-8 py-3 text-lg font-semibold"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add New Course
                        </Button>
                    )}
                </div>

                {/* --- */}
                {/* Overview Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
                    <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer border border-blue-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Total Courses</CardTitle>
                            <BookOpen className="h-6 w-6 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mt-1">{totalCourses}</div>
                            <p className="text-xs opacity-80 mt-2">Overall course count</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-600 to-teal-700 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer border border-green-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Courses with Description</CardTitle>
                            <img src="https://placehold.co/24x24/ffffff/000000?text=📝" alt="Description Icon" className="h-6 w-6 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mt-1">{coursesWithDescription}</div>
                            <p className="text-xs opacity-80 mt-2">Courses with content detail</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-yellow-600 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer border border-orange-600">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Courses with Topics</CardTitle>
                            <img src="https://placehold.co/24x24/ffffff/000000?text=📚" alt="Topics Icon" className="h-6 w-6 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mt-1">{coursesWithTopics}</div>
                            <p className="text-xs opacity-80 mt-2">Courses having defined topics</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-600 to-pink-700 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer border border-red-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Courses with Batches</CardTitle>
                            <img src="https://placehold.co/24x24/ffffff/000000?text=🧑‍🏫" alt="Batches Icon" className="h-6 w-6 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mt-1">{coursesWithBatches}</div>
                            <p className="text-xs opacity-80 mt-2">Courses with active batches</p>
                        </CardContent>
                    </Card>
                </div>

                {/* --- */}
                {/* Conditional Rendering: Show Form or Course List */}
                {showForm ? (
                    <Card className="mt-8 shadow-2xl rounded-2xl p-8 bg-white/90 backdrop-blur-sm">
                        <Button
                            variant="outline"
                            onClick={handleFormClose}
                            className="mb-8 px-6 py-2 rounded-full shadow-md hover:bg-gray-100 transition-colors border border-gray-300 text-gray-700"
                        >
                            ← Back to Courses List
                        </Button>
                        <CourseForm
                            course={editingCourse} // Pass editing course or null for new
                            onClose={handleFormClose} // Handle form closure (including submission success)
                            onSubmit={handleFormSubmit} // Pass the submit handler to CourseForm
                        />
                    </Card>
                ) : (
                    <Card className="mt-8 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-sm">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-gray-200">
                            <CardTitle className="text-2xl font-bold text-gray-900">Available Courses 📚</CardTitle>
                            <CardDescription className="hidden sm:block text-gray-600">
                                Browse and manage all academic courses in your system.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-6" />
                                    <span className="text-xl font-medium">Loading courses...</span>
                                    <p className="text-base mt-2 text-center max-w-sm">Fetching the latest course information to populate your dashboard.</p>
                                </div>
                            ) : courses.length === 0 ? (
                                <div className="text-center py-16 text-gray-500">
                                    <img src="https://placehold.co/120x120/a7f3d0/065f46?text=📖" alt="No Courses Icon" className="mx-auto mb-6 transform rotate-6 transition-transform duration-300" />
                                    <p className="text-2xl font-bold text-gray-700">No courses available 😔</p>
                                    <p className="text-lg mt-3 text-gray-600">It looks like there are no courses registered yet.</p>
                                    <Button
                                        onClick={handleCreate}
                                        className="mt-8 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-full shadow-lg px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Add Your First Course
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {/* Using the CourseCard component for rendering each course */}
                                    {courses.map((course) => (
                                        <CourseCard
                                            key={course._id}
                                            course={course}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CourseManagementPage;
