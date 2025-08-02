import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { TeacherUser } from "@/types/teacher.types";

interface TeacherFormProps {
    teacherToEdit?: TeacherUser;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ teacherToEdit }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Partial<TeacherUser>>(
        teacherToEdit || { name: "", email: "", mobile: "", department: "Other", qualification: "", experience: 0, specialization: "" }
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: id === "experience" ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("Submitting teacher data:", formData);
        setTimeout(() => {
            setIsLoading(false);
            navigate("/dashboard/teachers");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mr-4">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                    {teacherToEdit ? "Edit Teacher" : "Add New Teacher"}
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{teacherToEdit ? "Edit Teacher" : "Teacher Details"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={formData.name || ""} onChange={handleInputChange} required />
                            </div>
                            {/* Removed Employee ID input field */}
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={formData.email || ""} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="mobile">Mobile Number</Label>
                                <Input id="mobile" value={formData.mobile || ""} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="department">Department</Label>
                                <Input id="department" value={formData.department || ""} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="qualification">Qualification</Label>
                                <Input id="qualification" value={formData.qualification || ""} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="specialization">Specialization</Label>
                                <Input id="specialization" value={formData.specialization || ""} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="experience">Experience (Years)</Label>
                                <Input id="experience" type="number" value={formData.experience || 0} onChange={handleInputChange} required />
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