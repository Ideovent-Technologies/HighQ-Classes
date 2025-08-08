import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { TeacherUser, CreateTeacherData } from "@/types/teacher.types";
import teacherService from "@/API/services/teacherService";
import { toast } from "react-hot-toast";

interface TeacherFormProps {
    teacherToEdit?: TeacherUser;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ teacherToEdit }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateTeacherData>({
        name: teacherToEdit?.name || "",
        email: teacherToEdit?.email || "",
        mobile: teacherToEdit?.mobile || "",
        employeeId: teacherToEdit?.employeeId || "",
        password: "", // Always empty for new teachers
        department: teacherToEdit?.department || "Other",
        qualification: teacherToEdit?.qualification || "",
        experience: teacherToEdit?.experience || 0,
        specialization: teacherToEdit?.specialization || "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: id === "experience" ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        console.log("Form submission started with data:", formData);

        // Validate required fields
        if (
            !formData.name ||
            !formData.email ||
            !formData.mobile ||
            !formData.employeeId ||
            !formData.password
        ) {
            toast.error("Please fill in all required fields");
            setIsLoading(false);
            return;
        }

        try {
            console.log("Sending teacher data to API:", formData);
            const result = await teacherService.AddTeacher(formData);
            console.log("Teacher creation result:", result);

            if (result.success) {
                toast.success("Teacher created successfully!");
                console.log("Teacher created successfully, navigating back");
                navigate("/dashboard/teacher-management");
            } else {
                console.error("Teacher creation failed:", result.message);
                toast.error(result.message || "Failed to create teacher");
            }
        } catch (error) {
            console.error("Exception during teacher creation:", error);
            toast.error("An error occurred while creating the teacher");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="mr-4"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                    {teacherToEdit ? "Edit Teacher" : "Add New Teacher"}
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {teacherToEdit ? "Edit Teacher" : "Teacher Details"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="employeeId">Employee ID</Label>
                                <Input
                                    id="employeeId"
                                    value={formData.employeeId || ""}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., EMP001"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password || ""}
                                    onChange={handleInputChange}
                                    required
                                    minLength={6}
                                    placeholder="Minimum 6 characters"
                                />
                            </div>
                            <div>
                                <Label htmlFor="mobile">Mobile Number</Label>
                                <Input
                                    id="mobile"
                                    value={formData.mobile || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    value={formData.department || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="qualification">
                                    Qualification
                                </Label>
                                <Input
                                    id="qualification"
                                    value={formData.qualification || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="specialization">
                                    Specialization
                                </Label>
                                <Input
                                    id="specialization"
                                    value={formData.specialization || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="experience">
                                    Experience (Years)
                                </Label>
                                <Input
                                    id="experience"
                                    type="number"
                                    value={formData.experience || 0}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Teacher"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default TeacherForm;
