import React, { useState, useEffect } from "react";
// Removed useNavigate as it's no longer directly used in favor of onCancel prop
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Loader2 } from "lucide-react"; // Added Loader2 for button loading state
import {
    TeacherUser,
    CreateTeacherData,
    DepartmentType,
} from "@/types/teacher.types";
import teacherService from "@/API/services/teacherService";
import { toast } from "react-hot-toast"; // You might want to switch this to your useToast hook from Shadcn UI for consistency

// UPDATED: Defined TeacherFormProps with optional props for backward compatibility
interface TeacherFormProps {
    teacherToEdit?: TeacherUser;
    onSubmit?: (
        data: CreateTeacherData | Partial<TeacherUser>
    ) => Promise<void>;
    onCancel?: () => void;
}

const TeacherForm: React.FC<TeacherFormProps> = ({
    teacherToEdit,
    onSubmit,
    onCancel,
}) => {
    // const navigate = useNavigate(); // No longer needed as onCancel handles navigation/hiding

    // Define initial state for new teachers
    const initialFormData: CreateTeacherData = {
        name: "",
        email: "",
        mobile: "",
        employeeId: "",
        password: "", // Password is only required for new teachers
        department: "Other", // Default value
        qualification: "",
        experience: 0,
        specialization: "",
    };

    // State to manage form data, can be CreateTeacherData (for new) or Partial<TeacherUser> (for update)
    const [formData, setFormData] = useState<
        CreateTeacherData | Partial<TeacherUser>
    >(initialFormData);
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator

    // Populate form data when teacherToEdit changes (for editing an existing teacher)
    useEffect(() => {
        if (teacherToEdit) {
            setFormData({
                name: teacherToEdit.name,
                email: teacherToEdit.email,
                mobile: teacherToEdit.mobile,
                employeeId: teacherToEdit.employeeId, // Assuming employeeId is always present on existing TeacherUser
                qualification: teacherToEdit.qualification,
                experience: teacherToEdit.experience,
                specialization: teacherToEdit.specialization,
                department: teacherToEdit.department,
                // Password should not be pre-filled for security reasons when editing
                password: "",
                gender: teacherToEdit.gender,
                dateOfBirth: teacherToEdit.dateOfBirth,
                bio: teacherToEdit.bio,
                subjects: teacherToEdit.subjects,
            });
        } else {
            setFormData(initialFormData); // Reset form for adding a new teacher
        }
    }, [teacherToEdit]); // Dependency array: re-run when teacherToEdit changes

    /**
     * Handles changes to input and select elements, updating the formData state.
     */
    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: id === "experience" ? parseInt(value) : value, // Convert experience to number
        }));
    };

    /**
     * Handles changes for select elements that might not have an 'id' directly from event.target.
     */
    const handleSelectChange = (
        id: keyof (CreateTeacherData | Partial<TeacherUser>),
        value: string | number | string[]
    ) => {
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    /**
     * Handles form submission. Performs validation and calls the onSubmit prop.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        setIsLoading(true); // Set loading state to true

        console.log("TeacherForm submission started with data:", formData);

        // Determine if we are creating or updating
        const isCreating = !teacherToEdit;

        // Basic validation for required fields
        if (
            !formData.name ||
            !formData.email ||
            !formData.mobile ||
            !formData.employeeId ||
            !formData.qualification ||
            !formData.specialization ||
            !formData.department ||
            formData.experience === undefined
        ) {
            toast.error("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        // Additional validation for password only if creating a new teacher
        if (
            isCreating &&
            (!formData.password || formData.password.length < 6)
        ) {
            toast.error(
                "Password is required and must be at least 6 characters for a new teacher."
            );
            setIsLoading(false);
            return;
        }

        try {
            if (onSubmit) {
                // Call the onSubmit prop passed from TeacherManagementPage
                await onSubmit(formData);
            } else {
                // Default behavior when no onSubmit prop is provided
                const API_BASE_URL = "http://localhost:8080/api";

                if (isCreating) {
                    // Create a new teacher
                    const response = await fetch(
                        `${API_BASE_URL}/admin/teachers/register`,
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
                            error.message || "Failed to create teacher"
                        );
                    }

                    toast.success("Teacher created successfully!");
                } else {
                    // Update existing teacher
                    const teacherId =
                        (formData as Partial<TeacherUser>)._id ||
                        teacherToEdit?._id;
                    if (!teacherId) {
                        throw new Error("Teacher ID is required for updates");
                    }

                    const response = await fetch(
                        `${API_BASE_URL}/admin/teachers/${teacherId}`,
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
                            error.message || "Failed to update teacher"
                        );
                    }

                    toast.success("Teacher updated successfully!");
                }

                // Navigate back or refresh data if onCancel is not provided
                if (onCancel) {
                    onCancel();
                } else {
                    window.history.back();
                }
            }
        } catch (error) {
            // Error handling is primarily done in TeacherManagementPage's handleFormSubmit,
            // but a generic toast can be added here if needed for unexpected issues.
            console.error("Error during form submission (TeacherForm):", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred during submission."
            );
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    // Predefined departments for the select input
    const departments: DepartmentType[] = [
        "Mathematics",
        "Science",
        "English",
        "Hindi",
        "Social Science",
        "Computer Science",
        "Physics",
        "Chemistry",
        "Biology",
        "Other",
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                {/* Button to go back, using the onCancel prop or default behavior */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onCancel || (() => window.history.back())}
                    className="mr-4"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                    {teacherToEdit ? "Edit Teacher" : "Add New Teacher"}
                </h1>
            </div>

            <Card className="rounded-xl shadow-lg">
                {" "}
                {/* Added refined styling to Card */}
                <CardHeader className="border-b px-6 py-4">
                    {" "}
                    {/* Added border-b and padding */}
                    <CardTitle className="text-xl font-semibold">
                        {teacherToEdit
                            ? "Edit Teacher Details"
                            : "Enter Teacher Details"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {" "}
                    {/* Increased padding */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {" "}
                        {/* Increased space between form elements */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {" "}
                            {/* Responsive grid layout */}
                            <div>
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name || ""}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="employeeId"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Employee ID
                                </Label>
                                <Input
                                    id="employeeId"
                                    value={formData.employeeId || ""}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., EMP001"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ""}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                />
                            </div>
                            {/* Password field only shown for new teachers for security */}
                            {!teacherToEdit && (
                                <div>
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password || ""}
                                        onChange={handleInputChange}
                                        required
                                        minLength={6}
                                        placeholder="Minimum 6 characters"
                                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                    />
                                </div>
                            )}
                            <div>
                                <Label
                                    htmlFor="mobile"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Mobile Number
                                </Label>
                                <Input
                                    id="mobile"
                                    value={formData.mobile || ""}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="department"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Department
                                </Label>
                                {/* Using a native select for simplicity, apply Shadcn select styling if available */}
                                <select
                                    id="department"
                                    value={formData.department || "Other"}
                                    onChange={(e) =>
                                        handleSelectChange(
                                            "department",
                                            e.target.value
                                        )
                                    }
                                    required
                                    className="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-all duration-200"
                                >
                                    {departments.map((dept) => (
                                        <option key={dept} value={dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label
                                    htmlFor="qualification"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Qualification
                                </Label>
                                <Input
                                    id="qualification"
                                    value={formData.qualification || ""}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="specialization"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Specialization
                                </Label>
                                <Input
                                    id="specialization"
                                    value={formData.specialization || ""}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="experience"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Experience (Years)
                                </Label>
                                <Input
                                    id="experience"
                                    type="number"
                                    value={
                                        formData.experience !== undefined
                                            ? formData.experience
                                            : ""
                                    }
                                    onChange={handleInputChange}
                                    required
                                    min={0}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                />
                            </div>
                            {/* Optional fields can be added here with similar styling */}
                            {/* For example, Gender, Date of Birth, Bio, Subjects */}
                            {/*
                            <div>
                                <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
                                <select
                                    id="gender"
                                    value={formData.gender || ""}
                                    onChange={(e) => handleSelectChange("gender", e.target.value)}
                                    className="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-all duration-200"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth</Label>
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                />
                            </div>
                            <div className="md:col-span-2 lg:col-span-3"> // Example for spanning multiple columns
                                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Biography</Label>
                                <textarea
                                    id="bio"
                                    value={formData.bio || ""}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                />
                            </div>
                            */}
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg py-2 text-lg font-semibold transition-all duration-300 shadow-lg transform hover:scale-[1.01]" // Enhanced button style
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                                    Saving...
                                </>
                            ) : teacherToEdit ? (
                                "Update Teacher"
                            ) : (
                                "Add Teacher"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default TeacherForm;
