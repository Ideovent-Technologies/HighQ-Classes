import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Loader2 } from "lucide-react";
import {
    TeacherUser,
    CreateTeacherData,
    DepartmentType,
} from "@/types/teacher.types";
import { toast } from "react-hot-toast";

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
    const initialFormData: CreateTeacherData = {
        name: "",
        email: "",
        mobile: "",
        employeeId: "",
        password: "",
        department: "Other",
        qualification: "",
        experience: 0,
        specialization: "",
    };

    const [formData, setFormData] = useState<
        CreateTeacherData | Partial<TeacherUser>
    >(initialFormData);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (teacherToEdit) {
            setFormData({
                name: teacherToEdit.name,
                email: teacherToEdit.email,
                mobile: teacherToEdit.mobile,
                employeeId: teacherToEdit.employeeId,
                qualification: teacherToEdit.qualification,
                experience: teacherToEdit.experience,
                specialization: teacherToEdit.specialization,
                department: teacherToEdit.department,
                password: "",
                gender: teacherToEdit.gender,
                dateOfBirth: teacherToEdit.dateOfBirth,
                bio: teacherToEdit.bio,
                subjects: teacherToEdit.subjects,
            });
        } else {
            setFormData(initialFormData);
        }
    }, [teacherToEdit]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: id === "experience" ? parseInt(value) || 0 : value,
        }));
    };

    const handleSelectChange = (
        id: keyof (CreateTeacherData | Partial<TeacherUser>),
        value: string | number | string[]
    ) => {
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const isCreating = !teacherToEdit;

        if (
            !formData.name ||
            !formData.email ||
            !formData.mobile ||
            !formData.employeeId ||
            !formData.qualification ||
            !formData.specialization ||
            !formData.department ||
            (formData.experience === undefined || formData.experience === null)
        ) {
            toast.error("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        if (isCreating && (!formData.password || formData.password.length < 6)) {
            toast.error(
                "Password is required and must be at least 6 characters for a new teacher."
            );
            setIsLoading(false);
            return;
        }

        try {
            if (onSubmit) {
                await onSubmit(formData);
            } else {
                const API_BASE_URL = "http://localhost:8080/api";

                if (isCreating) {
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

                if (onCancel) {
                    onCancel();
                } else {
                    window.history.back();
                }
            }
        } catch (error) {
            console.error("Error during form submission (TeacherForm):", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred during submission."
            );
        } finally {
            setIsLoading(false);
        }
    };

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
                <CardHeader className="border-b px-6 py-4">
                    <CardTitle className="text-xl font-semibold">
                        {teacherToEdit
                            ? "Edit Teacher Details"
                            : "Enter Teacher Details"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Full Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name || ""}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter full name"
                                    className="mt-1 block w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">This should be the teacher's legal full name.</p>
                            </div>
                            <div>
                                <Label
                                    htmlFor="employeeId"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Employee ID <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="employeeId"
                                    value={formData.employeeId || ""}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., EMP001"
                                    className="mt-1 block w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">Must be a unique ID for the teacher.</p>
                            </div>
                            <div>
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ""}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., john.doe@school.edu"
                                    className="mt-1 block w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">The email must be a valid format.</p>
                            </div>
                            {!teacherToEdit && (
                                <div>
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Password <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password || ""}
                                        onChange={handleInputChange}
                                        required
                                        minLength={6}
                                        placeholder="Minimum 6 characters"
                                        className="mt-1 block w-full"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Required for new teachers, min 6 characters.</p>
                                </div>
                            )}
                            <div>
                                <Label
                                    htmlFor="mobile"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Mobile Number <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="mobile"
                                    value={formData.mobile || ""}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., 9876543210"
                                    className="mt-1 block w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">Enter the 10-digit mobile number.</p>
                            </div>
                            <div>
                                <Label
                                    htmlFor="department"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Department <span className="text-red-500">*</span>
                                </Label>
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
                                    className="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                                >
                                    <option value="" disabled>Select a department</option>
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
                                    Qualification <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="qualification"
                                    value={formData.qualification || ""}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., M.Sc, B.Ed"
                                    className="mt-1 block w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">Highest educational qualification.</p>
                            </div>
                            <div>
                                <Label
                                    htmlFor="specialization"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Specialization <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="specialization"
                                    value={formData.specialization || ""}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., Organic Chemistry"
                                    className="mt-1 block w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">The area of specific expertise.</p>
                            </div>
                            <div>
                                <Label
                                    htmlFor="experience"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Experience (Years) <span className="text-red-500">*</span>
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
                                    placeholder="e.g., 5"
                                    className="mt-1 block w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">Total years of teaching experience.</p>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg py-2 text-lg font-semibold transition-all duration-300 shadow-lg transform hover:scale-[1.01]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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