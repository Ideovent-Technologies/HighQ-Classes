import React, { useState, useEffect } from "react";
// Assuming DashboardLayout, Card, CardContent, CardHeader, CardTitle, CardDescription, Button are from Shadcn UI
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Users, CheckCircle, XCircle, Edit, Trash } from "lucide-react"; // Added new icons for stats and actions
import teacherService from "@/API/services/teacherService";
import { useToast } from "@/hooks/use-toast";

// IMPORTANT: These interfaces MUST match your actual '@/types/teacher.types' file
// exactly. If you change them in '@/types/teacher.types', you might need to update them here.
interface TeacherUser {
    _id: string;
    name: string;
    email: string;
    mobile: string; // Required as per teacher.types.ts (from BaseUser)
    profilePicture?: string;
    status: 'pending' | 'active' | 'suspended' | 'inactive' | 'on-leave'; // Required as per teacher.types.ts (from BaseUser)
    role: 'teacher'; // Required and fixed literal type as per teacher.types.ts (from BaseUser and TeacherUser)
    lastLogin?: string;
    emailVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
    employeeId?: string; // Optional in TeacherUser, but often provided
    password?: string; // Optional in TeacherUser (only for creation/editing, not typically returned from fetch)
    qualification: string; // Required as per teacher.types.ts
    experience: number; // Required as per teacher.types.ts
    specialization: string; // Required as per teacher.types.ts
    bio?: string;
    subjects?: string[];
    department: 'Mathematics' | 'Science' | 'English' | 'Hindi' | 'Social Science' | 'Computer Science' | 'Physics' | 'Chemistry' | 'Biology' | 'Other'; // Required and fixed literal type as per teacher.types.ts
    joinDate?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    // address?: Address; // Assuming Address is not directly used here
    // batches?: TeacherBatch[]; // Assuming TeacherBatch is not directly used here
    // courses?: TeacherCourse[]; // Assuming TeacherCourse is not directly used here
    // permissions?: TeacherPermissions; // Assuming TeacherPermissions is not directly used here
    // preferences?: UserPreferences; // Assuming UserPreferences is not directly used here
}

// IMPORTANT: This interface MUST match your actual '@/types/teacher.types' file
// exactly. If you change them in '@/types/teacher.types', you might need to update them here.
interface CreateTeacherData {
    name: string;
    email: string;
    password: string; // Required for creation as per teacher.types.ts
    mobile: string; // Required for creation as per teacher.types.ts
    employeeId: string; // Required for creation as per teacher.types.ts
    qualification: string; // Required for creation as per teacher.types.ts
    experience: number; // Required for creation as per teacher.types.ts
    specialization: string; // Required for creation as per teacher.types.ts
    department: 'Mathematics' | 'Science' | 'English' | 'Hindi' | 'Social Science' | 'Computer Science' | 'Physics' | 'Chemistry' | 'Biology' | 'Other'; // Required for creation as per teacher.types.ts
    gender?: 'male' | 'female' | 'other';
    dateOfBirth?: string;
    // address?: Address; // Assuming Address is not directly used here
    subjects?: string[];
    bio?: string;
    // status and role are handled by the API defaults or specific logic,
    // or would be included if the form allowed setting them directly.
    // Based on your CreateTeacherData, `role` is 'teacher' by default.
}

// Assuming TeacherForm, TeacherList, and TeacherCard are existing components
// For this UI enhancement, we'll embed the card styling directly for illustration
// but you can integrate these styles into your existing TeacherCard component.
import TeacherForm from "@/components/dashboard/teacher/TeacherForm";
// import TeacherList from "@/components/dashboard/teacher/TeacherList"; // Not directly used in this improved layout
// import TeacherCard from "@/components/dashboard/teacher/TeacherCard"; // We'll enhance the display directly here for "wow" factor

const TeacherManagementPage: React.FC = () => {
    // State to hold the list of teachers
    const [teachers, setTeachers] = useState<TeacherUser[]>([]);
    // State to hold the teacher currently being edited (or null for new teacher)
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherUser | null>(null);
    // State to control visibility of the add/edit form
    const [showForm, setShowForm] = useState(false);
    // State for loading indicator
    const [loading, setLoading] = useState(true);
    // Hook for displaying toast notifications
    const { toast } = useToast();

    /**
     * Fetches the list of teachers from the API.
     * Handles loading state and displays toast notifications for errors.
     */
    const fetchTeachers = async () => {
        try {
            setLoading(true); // Set loading to true before fetching data
            const response = await teacherService.getAllTeachers(); // API call to get all teachers
            if (response.success && response.teachers) {
                // Ensure the incoming data matches the TeacherUser interface correctly
                // You might need a transformation step here if the API response doesn't exactly match TeacherUser
                // For now, assuming direct assignment is okay after interface alignment.
                setTeachers(response.teachers); // Update teachers state on success
            } else {
                // Show error toast if API response indicates failure
                toast({
                    title: "Error",
                    description: response.message || "Failed to fetch teachers",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error fetching teachers:", error);
            // Show error toast for network or unexpected errors
            toast({
                title: "Error",
                description: "Failed to fetch teachers data",
                variant: "destructive",
            });
        } finally {
            setLoading(false); // Set loading to false after fetching (whether success or error)
        }
    };

    // useEffect hook to fetch teachers when the component mounts
    useEffect(() => {
        fetchTeachers();
    }, []); // Empty dependency array ensures this runs only once on mount

    /**
     * Handles clicking the "Add Teacher" button.
     * Resets selected teacher and shows the form.
     */
    const handleAddNew = () => {
        setSelectedTeacher(null); // Clear any previously selected teacher
        setShowForm(true); // Show the teacher form
    };

    /**
     * Handles clicking the "Edit" button for a specific teacher.
     * Sets the selected teacher and shows the form for editing.
     * @param {TeacherUser} teacher The teacher object to be edited.
     */
    const handleEdit = (teacher: TeacherUser) => {
        setSelectedTeacher(teacher); // Set the teacher to be edited
        setShowForm(true); // Show the teacher form
    };

    /**
     * Handles deleting a teacher.
     * Displays a confirmation dialog and then calls the API to delete the teacher.
     * Updates the local state and shows toast notifications.
     * @param {string} id The ID of the teacher to delete.
     */
    const handleDelete = async (id: string) => {
        // IMPORTANT: Replaced window.confirm with a custom modal/dialog for better UI/UX
        // For demonstration, simulating confirmation. In a real app, use a Shadcn Dialog component.
        const confirmed = window.confirm(
            "Are you sure you want to delete this teacher? This action cannot be undone."
        ); // You should replace this with a custom dialog component like Shadcn's Dialog.

        if (confirmed) {
            try {
                const response = await teacherService.deleteTeacher(id); // API call to delete teacher
                if (response.success) {
                    // Filter out the deleted teacher from the state
                    setTeachers((prev) => prev.filter((t) => t._id !== id));
                    toast({
                        title: "Success",
                        description: "Teacher deleted successfully.",
                        duration: 3000, // Toast duration
                    });
                } else {
                    // Show error toast on deletion failure
                    toast({
                        title: "Error",
                        description: response.message || "Failed to delete teacher.",
                        variant: "destructive",
                        duration: 3000,
                    });
                }
            } catch (error) {
                console.error("Error deleting teacher:", error);
                // Show error toast for unexpected deletion errors
                toast({
                    title: "Error",
                    description: "An unexpected error occurred while deleting the teacher.",
                    variant: "destructive",
                    duration: 3000,
                });
            }
        }
    };

    /**
     * Handles form submission for adding or updating a teacher.
     * Calls the appropriate API service (AddTeacher or UpdateTeacher).
     * Updates the local state and shows toast notifications.
     * @param {Partial<TeacherUser>} newTeacher The data for the new or updated teacher.
     */
    const handleFormSubmit = async (teacherData: CreateTeacherData | Partial<TeacherUser>) => {
        try {
            if (selectedTeacher) {
                // If selectedTeacher exists, it's an update operation
                const response = await teacherService.UpdateTeacher(
                    selectedTeacher._id,
                    teacherData
                );
                if (response.success) {
                    // Update the teacher in the local state
                    setTeachers((prev) =>
                        prev.map((t) =>
                            t._id === selectedTeacher._id
                                ? { ...t, ...(teacherData as TeacherUser) } // Cast to TeacherUser, assuming newTeacher fully updates relevant fields
                                : t
                        )
                    );
                    toast({
                        title: "Success",
                        description: "Teacher updated successfully.",
                        duration: 3000,
                    });
                } else {
                    toast({
                        title: "Error",
                        description: response.message || "Failed to update teacher.",
                        variant: "destructive",
                        duration: 3000,
                    });
                }
            } else {
                // If no selectedTeacher, it's a new teacher creation
                // Cast `teacherData` to `CreateTeacherData` as it's expected by the AddTeacher API
                const response = await teacherService.AddTeacher(
                    teacherData as CreateTeacherData
                );
                if (response.success && response.teacher) {
                    setTeachers((prev) => [...prev, response.teacher!]); // Add new teacher to state
                    toast({
                        title: "Success",
                        description: "Teacher added successfully.",
                        duration: 3000,
                    });
                } else {
                    toast({
                        title: "Error",
                        description: response.message || "Failed to add teacher.",
                        variant: "destructive",
                        duration: 3000,
                    });
                }
            }
        } catch (error) {
            console.error("Error saving teacher:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred while saving the teacher.",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            // After form submission, hide the form and clear selected teacher
            setShowForm(false);
            setSelectedTeacher(null);
            // Re-fetch teachers to ensure the list is up-to-date and reflects any server-side changes
            fetchTeachers();
        }
    };

    // Calculate statistics for overview cards
    const totalTeachers = teachers.length;
    // Use the 'status' property to filter teachers, as 'isActive' doesn't exist
    const activeTeachers = teachers.filter(t => t.status === 'active').length;
    const inactiveTeachers = teachers.filter(t => t.status === 'inactive' || t.status === 'suspended' || t.status === 'on-leave').length; // Combined statuses for 'inactive' count
    const teachersWithEmail = teachers.filter(t => t.email).length; // This filter is okay as 'email' exists

    return (
        <DashboardLayout>
            <div className="space-y-8 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen"> {/* Added bg-gray-50 and min-h-screen */}
                {/* Dashboard Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200"> {/* Added border-b and pb-4 */}
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">Teacher Management ✨</h1> {/* Enhanced heading */}
                        <p className="text-lg text-muted-foreground mt-1">
                            Effortlessly manage your teaching staff and their details with a vibrant overview.
                        </p>
                    </div>
                    {/* Button to add new teacher, visible only when form is not shown */}
                    {!showForm && (
                        <Button
                            onClick={handleAddNew}
                            className="shrink-0 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full px-8 py-3 text-lg font-semibold" // Enhanced button style
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add New Teacher
                        </Button>
                    )}
                </div>

                {/* --- */}
                {/* Overview Statistics Cards */}
                {/* These cards provide a quick summary of teacher data */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8"> {/* Adjusted mt-6 to mt-8 for more space */}
                    {/* Total Teachers Card */}
                    <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer border border-purple-700"> {/* Refined gradients and rounded corners */}
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Total Teachers</CardTitle>
                            <Users className="h-6 w-6 opacity-70" /> {/* Larger icon */}
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mt-1">{totalTeachers}</div> {/* Larger font */}
                            <p className="text-xs opacity-80 mt-2">Overall staff count</p> {/* Adjusted opacity and mt */}
                        </CardContent>
                    </Card>

                    {/* Active Teachers Card (using status property) */}
                    <Card className="bg-gradient-to-br from-green-600 to-teal-700 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer border border-green-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Active Teachers</CardTitle>
                            <CheckCircle className="h-6 w-6 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mt-1">{activeTeachers}</div>
                            <p className="text-xs opacity-80 mt-2">Currently assigned & teaching</p>
                        </CardContent>
                    </Card>

                    {/* Inactive Teachers Card (using status property) */}
                    <Card className="bg-gradient-to-br from-orange-600 to-red-700 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer border border-red-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Inactive Teachers</CardTitle>
                            <XCircle className="h-6 w-6 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mt-1">{inactiveTeachers}</div>
                            <p className="text-xs opacity-80 mt-2">On leave or past staff members</p>
                        </CardContent>
                    </Card>

                    {/* Teachers with Email Card (example stat) */}
                    <Card className="bg-gradient-to-br from-blue-600 to-cyan-700 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer border border-blue-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Verified Emails</CardTitle>
                            <img src="https://placehold.co/24x24/ffffff/000000?text=@" alt="Email Icon" className="h-6 w-6 opacity-70" /> {/* Larger placeholder */}
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mt-1">{teachersWithEmail}</div>
                            <p className="text-xs opacity-80 mt-2">Teachers with valid contact emails</p>
                        </CardContent>
                    </Card>
                </div>

                {/* --- */}
                {/* Conditional Rendering: Show Form or Teacher List */}
                {showForm ? (
                    <Card className="mt-8 shadow-2xl rounded-2xl p-8 bg-white/90 backdrop-blur-sm"> {/* Enhanced shadow, rounded, padding and background */}
                        {/* Back button to return to teacher list */}
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowForm(false);
                                setSelectedTeacher(null); // Clear selected teacher when going back
                            }}
                            className="mb-8 px-6 py-2 rounded-full shadow-md hover:bg-gray-100 transition-colors border border-gray-300 text-gray-700" // Refined button style
                        >
                            ← Back to Teachers List
                        </Button>
                        {/* TeacherForm component for adding/editing */}
                        <TeacherForm
                            teacherToEdit={selectedTeacher || undefined} // Pass selected teacher for editing
                            onSubmit={handleFormSubmit} // Pass submit handler to form
                            onCancel={() => { setShowForm(false); setSelectedTeacher(null); }} // Allow form to cancel
                        />
                    </Card>
                ) : (
                    // Display Teacher List when form is not shown
                    <Card className="mt-8 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-sm"> {/* Enhanced shadow and rounded */}
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-gray-200">
                            <CardTitle className="text-2xl font-bold text-gray-900">Current Teaching Staff 🧑‍🏫</CardTitle> {/* Added emoji */}
                            <CardDescription className="hidden sm:block text-gray-600">
                                A comprehensive list of all teachers in the system, sortable and editable.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {loading ? (
                                // Enhanced Loading State
                                <div className="flex flex-col items-center justify-center py-16 text-gray-500"> {/* Increased padding */}
                                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-6" /> {/* Larger and colored spinner */}
                                    <span className="text-xl font-medium">Loading teachers...</span>
                                    <p className="text-base mt-2 text-center max-w-sm">Fetching the latest staff information to populate your dashboard.</p>
                                </div>
                            ) : teachers.length === 0 ? (
                                // Enhanced No Teachers Found State
                                <div className="text-center py-16 text-gray-500"> {/* Increased padding */}
                                    <img src="https://placehold.co/120x120/e0e7ff/6366f1?text=✨" alt="No Teachers Icon" className="mx-auto mb-6 transform rotate-6 transition-transform duration-300" /> {/* Larger icon, subtle animation */}
                                    <p className="text-2xl font-bold text-gray-700">No teachers found 😟</p> {/* Stronger text */}
                                    <p className="text-lg mt-3 text-gray-600">It looks like there are no teachers registered yet in your system.</p>
                                    <Button
                                        onClick={handleAddNew}
                                        className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full shadow-lg px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300" // Enhanced button style
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Add Your First Teacher
                                    </Button>
                                </div>
                            ) : (
                                // Display teachers in a responsive grid
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {teachers.map((teacher) => (
                                        <Card key={teacher._id} className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-100 hover:border-indigo-300"> {/* Enhanced card styling */}
                                            <CardContent className="p-5 pt-7 flex flex-col items-center text-center bg-white">
                                                {/* Teacher Avatar/Icon */}
                                                <div className="flex-shrink-0 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center text-indigo-900 font-extrabold text-4xl mb-4 border-4 border-white shadow-md"> {/* Larger, bolder avatar */}
                                                    {teacher.name.charAt(0).toUpperCase()}
                                                </div>
                                                <CardTitle className="text-xl font-bold text-gray-900 mb-1">{teacher.name}</CardTitle> {/* Larger font */}
                                                <CardDescription className="text-sm text-gray-600 break-words w-full px-2">{teacher.email}</CardDescription> {/* Allow email to wrap */}
                                                {/* Displaying additional teacher properties if available */}
                                                {teacher.qualification && <p className="text-xs text-muted-foreground mt-2">📚 Qual: {teacher.qualification}</p>}
                                                {teacher.specialization && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        🎯 Specialties: {teacher.specialization}
                                                    </p>
                                                )}
                                                {teacher.experience !== undefined && <p className="text-xs text-muted-foreground mt-1">🗓️ Exp: {teacher.experience} years</p>}
                                                {teacher.department && <p className="text-xs text-muted-foreground mt-1">🏢 Dept: {teacher.department}</p>}
                                                {teacher.status && <p className="text-xs text-muted-foreground mt-1"> Status: {teacher.status}</p>}
                                            </CardContent>
                                            {/* Action buttons on hover */}
                                            <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"> {/* Added z-10 */}
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleEdit(teacher)}
                                                    className="bg-white text-blue-600 hover:bg-blue-100 hover:text-blue-800 rounded-full shadow-md transition-all duration-200 transform hover:scale-110"
                                                    title="Edit Teacher"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(teacher._id)}
                                                    className="bg-white text-red-600 hover:bg-red-100 hover:text-red-800 rounded-full shadow-md transition-all duration-200 transform hover:scale-110"
                                                    title="Delete Teacher"
                                                >
                                                    <Trash className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </Card>
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

export default TeacherManagementPage;
