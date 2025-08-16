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

// Types
import {
    Batch,
    CreateBatchData,
    CourseRef,
    TeacherRef,
    StudentRef,
} from "@/types/Batch.Types";

// Services
import courseService from "@/API/services/courseService";
import teacherService from "@/API/services/teacherService";
import batchService from "@/API/services/batchService";
import AdminService from "@/API/services/AdminService";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Corrected BatchFormProps interface to work in both create and edit modes
export interface BatchFormProps {
    initialData?: Batch; // Optional for create mode
    onSubmit?: (data: CreateBatchData) => Promise<void>; // Optional - will use default for create mode
    isSubmitting?: boolean; // Optional - will use internal state if not provided
}

const BatchForm: React.FC<BatchFormProps> = ({
    initialData,
    onSubmit,
    isSubmitting: externalIsSubmitting,
}) => {
    const navigate = useNavigate();

    // Use internal submitting state if not provided externally
    const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
    const isSubmitting =
        externalIsSubmitting !== undefined
            ? externalIsSubmitting
            : internalIsSubmitting;
    const [formData, setFormData] = useState<CreateBatchData>(() => ({
        name: initialData?.name || "",
        // Ensure that courseId and teacherId are strings,
        // and extract _id if they are objects (CourseRef, TeacherRef)
        courseId:
            typeof initialData?.courseId === "string"
                ? initialData.courseId
                : initialData?.courseId?._id || "",
        teacherId:
            typeof initialData?.teacherId === "string"
                ? initialData.teacherId
                : initialData?.teacherId?._id || "",
        // Map students to their _id strings, handling both string and object types
        students:
            initialData?.students?.map((student) =>
                typeof student === "string" ? student : student._id
            ) || [],
        schedule: {
            days: initialData?.schedule?.days || [],
            startTime: initialData?.schedule?.startTime || "",
            endTime: initialData?.schedule?.endTime || "",
        },
        // Format dates correctly for input type="date"
        startDate: initialData?.startDate?.split("T")[0] || "",
        endDate: initialData?.endDate?.split("T")[0] || "",
        description: initialData?.description || "",
        capacity: initialData?.capacity || 20,
    }));

    const [courses, setCourses] = useState<CourseRef[]>([]);
    const [teachers, setTeachers] = useState<TeacherRef[]>([]);
    const [allStudents, setAllStudents] = useState<StudentRef[]>([]);
    const [studentSearch, setStudentSearch] = useState("");

    // Use a separate loading state for fetching dropdown resources
    const [isLoadingResources, setIsLoadingResources] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditMode = !!initialData; // Use initialData for edit mode check

    // Fetch Courses, Teachers, and Students
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingResources(true); // Set loading for resources
            try {
                const [coursesData, teachersData, studentsData] = await Promise.all([
                    courseService.getAllCourses(),
                    teacherService.getAllTeachers(),
                    AdminService.getAllStudents(),
                ]);

                setCourses(coursesData.courses || []);
                setTeachers(teachersData.teachers || []);
                setAllStudents(studentsData.students || []);
            } catch (error) {
                toast.error("Failed to load required data.");
            } finally {
                setIsLoadingResources(false); // Clear loading for resources
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

        if (onSubmit) {
            // If onSubmit prop is provided (edit mode), use it
            await onSubmit(formData);
        } else {
            // Default behavior for create mode
            setInternalIsSubmitting(true);
            try {
                // Convert string dates to Date objects for the API
                const dataToSend: any = { ...formData };

                if (dataToSend.startDate) {
                    dataToSend.startDate = new Date(dataToSend.startDate);
                } else {
                    delete dataToSend.startDate;
                }
                if (dataToSend.endDate) {
                    dataToSend.endDate = new Date(dataToSend.endDate);
                } else {
                    delete dataToSend.endDate;
                }

                const response = await batchService.createBatch(dataToSend);

                if (response.success) {
                    toast.success("Batch created successfully!");
                    navigate("/dashboard/batches/manage");
                } else {
                    toast.error(response.message || "Failed to create batch.");
                }
            } catch (err) {
                toast.error("An error occurred while creating the batch.");
                console.error("Error creating batch:", err);
            } finally {
                setInternalIsSubmitting(false);
            }
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
                {/* Core Details */}
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
                                    {isLoadingResources ? (
                                        <SelectItem value="loading" disabled>
                                            Loading courses...
                                        </SelectItem>
                                    ) : courses.length > 0 ? (
                                        courses.map((course) => (
                                            <SelectItem
                                                key={course._id}
                                                value={course._id}
                                            >
                                                {course.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-courses" disabled>
                                            No courses available
                                        </SelectItem>
                                    )}
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
                                    {isLoadingResources ? (
                                        <SelectItem value="loading" disabled>
                                            Loading teachers...
                                        </SelectItem>
                                    ) : teachers.length > 0 ? (
                                        teachers.map((teacher) => (
                                            <SelectItem
                                                key={teacher._id}
                                                value={teacher._id}
                                            >
                                                {teacher.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem
                                            value="no-teachers"
                                            disabled
                                        >
                                            No teachers available
                                        </SelectItem>
                                    )}
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

                {/* Schedule & Duration */}
                <Card>
                    <CardHeader>
                        <CardTitle>Schedule & Duration</CardTitle>
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
                            <div>
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={formData.schedule?.startTime || ""}
                                    onChange={handleScheduleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={formData.schedule?.endTime || ""}
                                    onChange={handleScheduleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
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

                {/* Students */}
                <Card>
                    <CardHeader>
                        <CardTitle>Student Enrollment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-3 border rounded-md min-h-[120px]">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.students?.map((studentId) => {
                                    const student = allStudents.find(
                                        (s) => s._id === studentId
                                    );
                                    return (
                                        <div
                                            key={studentId}
                                            className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1 text-sm"
                                        >
                                            {student?.name || "Unknown"}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleStudent(studentId)
                                                }
                                                className="focus:outline-none"
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
                                        <Search className="h-4 w-4 mr-2" />
                                        <Input
                                            placeholder="Search students..."
                                            value={studentSearch}
                                            onChange={(e) => setStudentSearch(e.target.value)}
                                        />
                                    </div>
                                    {isLoadingResources ? (
                                        <div className="p-2 text-muted-foreground text-center text-sm">
                                            Loading students...
                                        </div>
                                    ) : filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <SelectItem
                                                key={student._id}
                                                value={student._id}
                                            >
                                                {student.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-2 text-muted-foreground text-center text-sm">
                                            No matching students found.
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting || isLoadingResources}
                        size="lg"
                    >
                        {isSubmitting && (
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