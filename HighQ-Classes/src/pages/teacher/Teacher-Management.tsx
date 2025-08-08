import React, { useState, useEffect } from "react";
import TeacherForm from "@/components/dashboard/teacher/TeacherForm";
import TeacherList from "@/components/dashboard/teacher/TeacherList";
import TeacherCard from "@/components/dashboard/teacher/TeacherCard";
import { TeacherUser, CreateTeacherData } from "@/types/teacher.types";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import teacherService from "@/API/services/teacherService";
import { useToast } from "@/hooks/use-toast";

const TeacherManagementPage: React.FC = () => {
    const [teachers, setTeachers] = useState<TeacherUser[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherUser | null>(
        null
    );
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Fetch teachers from API
    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const response = await teacherService.getAllTeachers();
            if (response.success && response.teachers) {
                setTeachers(response.teachers);
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to fetch teachers",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error fetching teachers:", error);
            toast({
                title: "Error",
                description: "Failed to fetch teachers",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleAddNew = () => {
        setSelectedTeacher(null);
        setShowForm(true);
    };

    const handleEdit = (teacher: TeacherUser) => {
        setSelectedTeacher(teacher);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this teacher?"
        );
        if (confirmed) {
            try {
                const response = await teacherService.deleteTeacher(id);
                if (response.success) {
                    setTeachers((prev) => prev.filter((t) => t._id !== id));
                    toast({
                        title: "Success",
                        description: "Teacher deleted successfully",
                    });
                } else {
                    toast({
                        title: "Error",
                        description:
                            response.message || "Failed to delete teacher",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error("Error deleting teacher:", error);
                toast({
                    title: "Error",
                    description: "Failed to delete teacher",
                    variant: "destructive",
                });
            }
        }
    };

    const handleFormSubmit = async (newTeacher: Partial<TeacherUser>) => {
        try {
            if (selectedTeacher) {
                // Update existing teacher
                const response = await teacherService.UpdateTeacher(
                    selectedTeacher._id,
                    newTeacher
                );
                if (response.success) {
                    setTeachers((prev) =>
                        prev.map((t) =>
                            t._id === selectedTeacher._id
                                ? { ...t, ...newTeacher }
                                : t
                        )
                    );
                    toast({
                        title: "Success",
                        description: "Teacher updated successfully",
                    });
                } else {
                    toast({
                        title: "Error",
                        description:
                            response.message || "Failed to update teacher",
                        variant: "destructive",
                    });
                }
            } else {
                // Create new teacher using API
                const response = await teacherService.AddTeacher(
                    newTeacher as CreateTeacherData
                );
                if (response.success && response.teacher) {
                    setTeachers((prev) => [...prev, response.teacher!]);
                    toast({
                        title: "Success",
                        description: "Teacher added successfully",
                    });
                } else {
                    toast({
                        title: "Error",
                        description:
                            response.message || "Failed to add teacher",
                        variant: "destructive",
                    });
                }
            }
        } catch (error) {
            console.error("Error saving teacher:", error);
            toast({
                title: "Error",
                description: "Failed to save teacher",
                variant: "destructive",
            });
        }
        setShowForm(false);
        setSelectedTeacher(null);
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Teacher Management</h1>
                {!showForm && (
                    <Button onClick={handleAddNew}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Teacher
                    </Button>
                )}
            </div>

            {showForm ? (
                <div>
                    <Button
                        variant="outline"
                        onClick={() => setShowForm(false)}
                        className="mb-4"
                    >
                        ← Back to Teachers
                    </Button>
                    <TeacherForm teacherToEdit={selectedTeacher || undefined} />
                </div>
            ) : loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading teachers...</span>
                </div>
            ) : teachers.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No teachers found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {teachers.map((teacher) => (
                        <div key={teacher._id} className="relative group">
                            <TeacherCard teacher={teacher} />
                            <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleEdit(teacher)}
                                >
                                    ✏️
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => handleDelete(teacher._id)}
                                >
                                    🗑️
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherManagementPage;
