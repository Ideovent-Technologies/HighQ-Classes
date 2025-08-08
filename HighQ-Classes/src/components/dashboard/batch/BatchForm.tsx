import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, Loader2, Search, X } from "lucide-react";
import { toast } from "react-hot-toast";

// Import your custom types from the separate file
import {
    Batch,
    CreateBatchData,
    CourseRef,
    TeacherRef,
    StudentRef,
} from "@/types/Batch.Types";

// Import services
import courseService from "@/API/services/courseService";
import teacherService from "@/API/services/teacherService";
import studentService from "@/API/services/studentService";
import batchService from "@/API/services/batchService";

// API service functions that transform responses to match our types
const apiService = {
    getCourses: async (): Promise<CourseRef[]> => {
        try {
            const response = await courseService.getAllCourses();
            if (response.success && response.courses) {
                return response.courses.map((course) => ({
                    _id: course._id,
                    name: course.name,
                }));
            }
            return [];
        } catch (error) {
            console.error("Error fetching courses:", error);
            return [];
        }
    },
    getTeachers: async (): Promise<TeacherRef[]> => {
        try {
            const response = await teacherService.getAllTeachers();
            if (response.success && response.teachers) {
                return response.teachers.map((teacher) => ({
                    _id: teacher._id,
                    name: teacher.name,
                }));
            }
            return [];
        } catch (error) {
            console.error("Error fetching teachers:", error);
            return [];
        }
    },
    getStudents: async (): Promise<StudentRef[]> => {
        try {
            // We'll need to check if studentService has a getAllStudents method
            // For now, return empty array and implement once we check the service
            return [];
        } catch (error) {
            console.error("Error fetching students:", error);
            return [];
        }
    },
    createBatch: async (data: CreateBatchData) => {
        try {
            // Transform our CreateBatchData to match batchService expected format
            const batchServiceData = {
                name: data.name,
                course: data.courseId,
                teacher: data.teacherId,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                schedule: data.schedule,
                capacity: data.capacity || 20,
                description: data.description || "",
            };
            const response = await batchService.createBatch(batchServiceData);
            return { success: true, message: "Batch created successfully!" };
        } catch (error) {
            console.error("Error creating batch:", error);
            return { success: false, message: "Failed to create batch" };
        }
    },
    updateBatch: async (id: string, data: Partial<CreateBatchData>) => {
        try {
            // Transform our CreateBatchData to match batchService expected format
            const batchServiceData: any = {
                name: data.name,
                course: data.courseId,
                teacher: data.teacherId,
                schedule: data.schedule,
                capacity: data.capacity,
                description: data.description,
            };
            if (data.startDate)
                batchServiceData.startDate = new Date(data.startDate);
            if (data.endDate) batchServiceData.endDate = new Date(data.endDate);

            const response = await batchService.updateBatch(
                id,
                batchServiceData
            );
            return { success: true, message: "Batch updated successfully!" };
        } catch (error) {
            console.error("Error updating batch:", error);
            return { success: false, message: "Failed to update batch" };
        }
    },
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface BatchFormProps {
    batchToEdit?: Batch;
}

const BatchForm: React.FC<BatchFormProps> = ({ batchToEdit }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateBatchData>(() => ({
        name: batchToEdit?.name || "",
        courseId:
            typeof batchToEdit?.courseId === "string"
                ? batchToEdit.courseId
                : batchToEdit?.courseId?._id || "",
        teacherId:
            typeof batchToEdit?.teacherId === "string"
                ? batchToEdit.teacherId
                : batchToEdit?.teacherId?._id || "",
        students:
            batchToEdit?.students?.map((student) =>
                typeof student === "string" ? student : student._id
            ) || [],
        schedule: {
            days: batchToEdit?.schedule?.days || [],
            startTime: batchToEdit?.schedule?.startTime || "",
            endTime: batchToEdit?.schedule?.endTime || "",
        },
        startDate: batchToEdit?.startDate?.split("T")[0] || "",
        endDate: batchToEdit?.endDate?.split("T")[0] || "",
    }));

    // State for dropdown options and search
    const [courses, setCourses] = useState<CourseRef[]>([]);
    const [teachers, setTeachers] = useState<TeacherRef[]>([]);
    const [allStudents, setAllStudents] = useState<StudentRef[]>([]);
    const [studentSearch, setStudentSearch] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isEditMode = !!batchToEdit;

    // Fetch data for dropdowns on component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [coursesData, teachersData, studentsData] =
                    await Promise.all([
                        apiService.getCourses(),
                        apiService.getTeachers(),
                        apiService.getStudents(),
                    ]);
                setCourses(coursesData);
                setTeachers(teachersData);
                setAllStudents(studentsData);
            } catch (error) {
                toast.error("Failed to load required data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Batch name is required.";
        if (!formData.courseId) newErrors.courseId = "Please select a course.";
        if (!formData.teacherId)
            newErrors.teacherId = "Please select a teacher.";
        if (
            formData.startDate &&
            formData.endDate &&
            formData.startDate > formData.endDate
        ) {
            newErrors.endDate = "End date cannot be before the start date.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearError = (fieldName: string) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        clearError(id);
    };

    const handleSelectChange = (id: string, value: string) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
        clearError(id);
    };

    const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            schedule: { ...prev.schedule!, [id]: value },
        }));
    };

    const handleDayToggle = (day: string) => {
        setFormData((prev) => {
            const currentDays = prev.schedule?.days || [];
            const newDays = currentDays.includes(day)
                ? currentDays.filter((d) => d !== day)
                : [...currentDays, day];
            return {
                ...prev,
                schedule: { ...prev.schedule!, days: newDays },
            };
        });
    };

    const toggleStudent = (studentId: string) => {
        setFormData((prev) => {
            const students = prev.students || [];
            const newStudents = students.includes(studentId)
                ? students.filter((id) => id !== studentId)
                : [...students, studentId];
            return { ...prev, students: newStudents };
        });
    };

    const filteredStudents = useMemo(() => {
        return allStudents.filter(
            (student) =>
                student.name
                    .toLowerCase()
                    .includes(studentSearch.toLowerCase()) &&
                !formData.students?.includes(student._id)
        );
    }, [studentSearch, allStudents, formData.students]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }
        setIsLoading(true);
        try {
            const response = isEditMode
                ? await apiService.updateBatch(batchToEdit._id, formData)
                : await apiService.createBatch(formData);

            if (response.success) {
                toast.success(response.message);
                navigate("/dashboard/batches");
            } else {
                toast.error(response.message || "An error occurred.");
            }
        } catch (error) {
            toast.error("Failed to save the batch.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center mb-6">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="mr-4"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditMode ? "Edit Batch" : "Create New Batch"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Core Details</CardTitle>
                        <CardDescription>
                            Provide the fundamental details for this batch.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Batch Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., MERN Evening - July 2024"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="courseId">Course</Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange("courseId", value)
                                }
                                value={formData.courseId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem
                                            key={course._id}
                                            value={course._id}
                                        >
                                            {course.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.courseId && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.courseId}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="teacherId">Lead Teacher</Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange("teacherId", value)
                                }
                                value={formData.teacherId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachers.map((teacher) => (
                                        <SelectItem
                                            key={teacher._id}
                                            value={teacher._id}
                                        >
                                            {teacher.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.teacherId && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.teacherId}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Schedule & Duration</CardTitle>
                        <CardDescription>
                            Define when the batch will run.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Days of the Week</Label>
                            <div className="flex flex-wrap gap-2">
                                {WEEK_DAYS.map((day) => (
                                    <Button
                                        key={day}
                                        type="button"
                                        variant={
                                            formData.schedule?.days.includes(
                                                day
                                            )
                                                ? "secondary"
                                                : "outline"
                                        }
                                        onClick={() => handleDayToggle(day)}
                                    >
                                        {day}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={formData.schedule?.startTime || ""}
                                    onChange={handleScheduleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={formData.schedule?.endTime || ""}
                                    onChange={handleScheduleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate || ""}
                                    onChange={handleInputChange}
                                />
                                {errors.endDate && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.endDate}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Student Enrollment</CardTitle>
                        <CardDescription>
                            Assign students to this batch.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-3 border rounded-md min-h-[120px]">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.students?.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        No students assigned yet.
                                    </p>
                                )}
                                {formData.students?.map((studentId) => {
                                    const student = allStudents.find(
                                        (s) => s._id === studentId
                                    );
                                    return (
                                        <div
                                            key={studentId}
                                            className="flex items-center gap-2 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm animate-in fade-in-0 zoom-in-95"
                                        >
                                            {student?.name || "Unknown"}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleStudent(studentId)
                                                }
                                                className="rounded-full hover:bg-muted p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <Select onValueChange={toggleStudent}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Add a student..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <div className="flex items-center border-b p-2">
                                        <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search students..."
                                            className="border-none focus-visible:ring-0"
                                            value={studentSearch}
                                            onChange={(e) =>
                                                setStudentSearch(e.target.value)
                                            }
                                        />
                                    </div>
                                    {filteredStudents.map((student) => (
                                        <SelectItem
                                            key={student._id}
                                            value={student._id}
                                        >
                                            {student.name}
                                        </SelectItem>
                                    ))}
                                    {filteredStudents.length === 0 && (
                                        <p className="p-4 text-center text-sm text-muted-foreground">
                                            No matching students found.
                                        </p>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} size="lg">
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isEditMode ? "Save Changes" : "Create Batch"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BatchForm;
